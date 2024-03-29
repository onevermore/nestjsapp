import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Auth } from 'src/auth/decorators/auth.decorator';

import { OnlyAdminGuard } from 'src/auth/guards/admin.guard';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import { Role } from 'src/user/enums/role.enum';
import { CreateTextDto } from './dto/create-text.dto';
import { IdValidationPipe } from './pipes/id.validation.pipe';
import { TextsModel } from './texts.model';
import { TextsService } from './texts.service';

@ApiTags('texts')
@Controller('texts')
export class TextsController {
  constructor(private readonly textsService: TextsService) {}

  @ApiOperation({ summary: 'Get all texts' })
  @Get()
  async getAllTexts(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.textsService.getAllTexts(page, limit);
  }

  @ApiOperation({ summary: 'Get texts by Id' })
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found text',
    type: TextsModel,
  })
  @ApiParam({ name: 'id', required: true, description: 'Text identifier' })
  async getById(@Param('id') textId: Types.ObjectId) {
    return this.textsService.getById(textId);
  }

  @Get('by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.textsService.getBySlug(slug);
  }

  @Get('by-complexity/:complexity')
  async getByComplexity(@Param('complexity') complexity: number) {
    return this.textsService.getByComplexity(complexity);
  }

  @Get('by-courses/:course')
  async byCourse(
    @Body('courseId')
    courseId: Types.ObjectId,
  ) {
    return this.textsService.byCourse(courseId);
  }
  /*
  @Get('by-courses/:course')
  async byCourseSlug(
    @Body('courseSlug')
    courseSlug: string,
  ) {
    return this.textsService.byCourseSlug(courseSlug);
  }
*/

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(200)
  async create(@Body() dto: CreateTextDto) {
    return await this.textsService.create(dto);
  }

  //@Get(':id')
  //async getTextById(@Param('id') id: string)

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Roles('admin', 'super')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateTextDto,
  ) {
    const updatedText = await this.textsService.update(id, dto);
    if (!updatedText) throw new NotFoundException('Text not found');
    return updatedText;
  }

  @Delete(':id')
  @Roles('admin', 'super')
  @UseGuards(JwtAuthGuard, RolesGuard)
  //@Auth('admin')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedDoc = await this.textsService.delete(id);
    if (!deletedDoc) throw new NotFoundException('Text not found');
  }
}
