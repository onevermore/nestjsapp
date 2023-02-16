import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CrosswordModel } from './crossword.model';

@Injectable()
export class CrosswordService {
    constructor(
        @InjectModel(CrosswordModel)
        private readonly crosswordModel: ModelType<CrosswordModel>,
      ) {}

    async getCrosswords(): Promise<any> {
        return this.crosswordModel.find().exec();
      }

}
