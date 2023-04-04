import { Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { CrosswordModel } from './crossword.model';
import { CreateCrosswordDto } from './dto/create-crossword.dto';

@Injectable()
export class CrosswordService {
  constructor(
    @InjectModel(CrosswordModel)
    private readonly crosswordModel: ModelType<CrosswordModel>,
  ) {}

  async getCrosswords(): Promise<any> {
    return this.crosswordModel.find().exec();
  }

  async create(createCourseDto: CreateCrosswordDto): Promise<CrosswordModel> {
    return new this.crosswordModel(createCourseDto).save();
  }

  async byCourse(
    courseId: Types.ObjectId,
  ): Promise<DocumentType<CrosswordModel>[]> {
    return this.crosswordModel.find({ course: courseId }).exec();
  }

  async getBySlug(slug: string): Promise<DocumentType<CrosswordModel>> {
    return this.crosswordModel.findOne({ slug }).exec();
  }
}
