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
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCourseDto } from './dto/create-course.dto';
import { IdValidationPipe } from 'src/texts/pipes/id.validation.pipe';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/user/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Types } from 'mongoose';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async getAllCourses(
    @Query('searchTerm') searchTerm?: string,
    @Query('level') level?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.coursesService.getAllCourses(searchTerm, level, page, limit);
  }

  @ApiOperation({ summary: 'Create course' })
  @Post()
  @HttpCode(200)
  async create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }

  @Get('by-user/:userId')
  async getByUser(@Param('userId') userId: Types.ObjectId) {
    return this.coursesService.getByUser(userId);
  }

  @Get('by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.coursesService.bySlug(slug);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  //@Auth('admin')
  @Roles('admin', 'super')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(
    @Param('id', IdValidationPipe) id: Types.ObjectId,
    @Body() dto: CreateCourseDto,
  ) {
    const updatedCourse = await this.coursesService.update(id, dto);
    if (!updatedCourse) throw new NotFoundException('Course not found');
    return updatedCourse;
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  //@Auth('admin')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedDoc = await this.coursesService.delete(id);
    if (!deletedDoc) throw new NotFoundException('Course not found');
  }
}
