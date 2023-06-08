import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { Types } from 'mongoose';
import { DictionaryModel } from './dictionary.model';
import { DictionaryService } from './dictionary.service';
import { AddWordToDictionaryDto } from './dto/add-word.dto';

@Controller('dictionary')
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Get(':userId/all-words')
  async getUserWords(
    @Param('userId') userId: Types.ObjectId,
  ): Promise<DictionaryModel[]> {
    const userWords = await this.dictionaryService.dictionaryByUser(userId);
    return userWords;
  }

  @Get(':textId/words/:userId')
  async getWordsByTextForUser(
    @Param('textId') textId: Types.ObjectId,
    @Param('userId') userId: Types.ObjectId,
  ): Promise<DictionaryModel[]> {
    const userWords = await this.dictionaryService.getWordsByTextForUser(
      textId,
      userId,
    );
    return userWords;
  }

  @Post('add-word')
  @HttpCode(200)
  async create(@Body() dto: AddWordToDictionaryDto) {
    return await this.dictionaryService.addWordToDictionary(dto);
  }
}
