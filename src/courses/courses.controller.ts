import { Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async getAll() {
    return this.coursesService.getCourses();
  }

  @Post()
  @HttpCode(200)
  async createe() {
    return this.coursesService.createe();
  }

  @Get('by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.coursesService.bySlug(slug);
  }
}
