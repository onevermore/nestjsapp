import { Injectable } from '@nestjs/common';
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
  ): Promise<DictionaryModel> {
    return new this.dictionaryModel(addWordDto).save();
  }

  async getWordsByTextForUser(textId: Types.ObjectId, userId: Types.ObjectId) {
    const a = await this.dictionaryModel.find({ userId, textId }).exec();

    return this.dictionaryModel.find({ userId, textId }).exec();
  }
}
