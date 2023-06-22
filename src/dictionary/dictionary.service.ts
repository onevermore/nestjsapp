import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { DictionaryModel } from './dictionary.model';
import { AddWordToDictionaryDto } from './dto/add-word.dto';

@Injectable()
export class DictionaryService {
  constructor(
    @InjectModel(DictionaryModel)
    private readonly dictionaryModel: ModelType<DictionaryModel>, // @Inject(forwardRef(() => CoursesService)) // private readonly courseService: CoursesService,
  ) {}

  async dictionaryByUser(
    userId: Types.ObjectId,
  ): Promise<DocumentType<DictionaryModel>[]> {
    return this.dictionaryModel.find({ userId: userId }).exec();
  }

  async addWordToDictionary(
    addWordDto: AddWordToDictionaryDto,
    //userId: Types.ObjectId,
  ): Promise<DictionaryModel> {
    if (!addWordDto.userId) throw new NotFoundException('User not found');
    // console.log('addWordDto === ', addWordDto);
    //  console.log('user ID when add === ', userId);
    const existingWord = await this.dictionaryModel
      .findOne({ word: addWordDto.word, userId: addWordDto.userId })
      .exec();

    if (existingWord)
      throw new BadRequestException('This word is already in your dictionary');

    return new this.dictionaryModel(addWordDto).save();
  }

  async getWordsByTextForUser(textId: Types.ObjectId, userId: Types.ObjectId) {
    const queryCond = {
      ...(textId && { textId }),
      userId,
    };

    // const a = await this.dictionaryModel.find({ userId, textId }).exec();

    return this.dictionaryModel.find(queryCond).exec();
  }

  async deleteWord(wordId: string, userId: string): Promise<any> {
    return this.dictionaryModel.deleteOne({ _id: wordId, userId }).exec();
  }
}
