import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCourseDto } from './dto/create-course.dto';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async getAllCourses(@Query('searchTerm') searchTerm?: string) {
    return this.coursesService.getAllCourses(searchTerm);
  }

  @ApiOperation({ summary: 'Create course' })
  @Post()
  @HttpCode(200)
  async create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }
  /*
  @Post()
  @HttpCode(200)
  async createe() {
    return this.coursesService.createe();
  }
*/

  @Get('by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.coursesService.bySlug(slug);
  }
}
