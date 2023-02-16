import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { CreateTextDto } from './dto/create-text.dto';
import { TextsModel } from './texts.model';
import { TextsService } from './texts.service';

@ApiTags('texts')
@Controller('texts')
export class TextsController {
  constructor(private readonly textsService: TextsService) {}

  @ApiOperation({ summary: 'Get all texts' })
  @Get()
  async getAllTexts() {
    return this.textsService.getAllTexts();
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

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(200)
  async create(@Body() dto: CreateTextDto) {
    return await this.textsService.create(dto);
  }

  //@Get(':id')
  //async getTextById(@Param('id') id: string)
}
