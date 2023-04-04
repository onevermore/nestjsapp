import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CrosswordService } from './crossword.service';
import { CreateCrosswordDto } from './dto/create-crossword.dto';

@ApiTags('crosswords')
@Controller('crosswords')
export class CrosswordController {
  constructor(private readonly crosswordService: CrosswordService) {}

  @Get()
  async getAll() {
    return this.crosswordService.getCrosswords();
  }

  @Get('by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.crosswordService.getBySlug(slug);
  }

  @ApiOperation({ summary: 'Create crossword' })
  @Post()
  @HttpCode(200)
  async create(@Body() dto: CreateCrosswordDto) {
    return this.crosswordService.create(dto);
  }
}
