import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  HttpCode,
  Param,
  Post,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { DictionaryModel } from './dictionary.model';
import { DictionaryService } from './dictionary.service';
import { AddWordToDictionaryDto } from './dto/add-word.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import { IdValidationPipe } from 'src/texts/pipes/id.validation.pipe';
import { CanDeleteWordGuard } from 'src/auth/guards/canDeleteWord.guard';

@Controller('dictionary')
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Get('all-words/:userId')
  async getUserWords(
    @Param('userId') userId: Types.ObjectId,
  ): Promise<DictionaryModel[]> {
    const userWords = await this.dictionaryService.dictionaryByUser(userId);
    return userWords;
  }

  @Get(':userId/words')
  async getWordsByTextForUser(
    @Param('userId') userId: Types.ObjectId,
    @Query('textId') textId?: Types.ObjectId,
  ): Promise<DictionaryModel[]> {
    const userWords = await this.dictionaryService.getWordsByTextForUser(
      textId,
      userId,
    );
    return userWords;
  }

  @Post('add-word')
  @HttpCode(200)
  // @Roles('user')
  @UseGuards(JwtAuthGuard)
  async addWordToDictionry(
    @Body() dto: AddWordToDictionaryDto,
    // @Req() req: Request,
  ) {
    //   const userId: Types.ObjectId = (req.user as any)._id;
    //    console.log('req === ', (req.user as any)._id);
    return await this.dictionaryService.addWordToDictionary(dto);
  }

  @Delete(':userId/words/:wordId')
  @UseGuards(JwtAuthGuard)
  async deleteWord(
    @Param('userId', IdValidationPipe) userId: string,
    @Param('wordId', IdValidationPipe) wordId: string,
  ) {
    const deletedDoc = await this.dictionaryService.deleteWord(wordId, userId);
    if (!deletedDoc) throw new NotFoundException('Word not found');
  }
}
