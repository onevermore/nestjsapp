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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCourseDto } from './dto/create-course.dto';
import { IdValidationPipe } from 'src/texts/pipes/id.validation.pipe';
import { Auth } from 'src/auth/decorators/auth.decorator';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async getAllCourses(
    @Query('searchTerm') searchTerm?: string,
    @Query('level') level?: string,
  ) {
    return this.coursesService.getAllCourses(searchTerm, level);
  }

  @ApiOperation({ summary: 'Create course' })
  @Post()
  @HttpCode(200)
  async create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }

  @Get('by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.coursesService.bySlug(slug);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateCourseDto,
  ) {
    const updatedCourse = await this.coursesService.update(id, dto);
    if (!updatedCourse) throw new NotFoundException('Course not found');
    return updatedCourse;
  }

  @Delete(':id')
  @Auth('admin')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedDoc = await this.coursesService.delete(id);
    if (!deletedDoc) throw new NotFoundException('Course not found');
  }
}
