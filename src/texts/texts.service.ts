import { Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { CreateTextDto } from './dto/create-text.dto';
import { TextsModel } from './texts.model';

@Injectable()
export class TextsService {
  constructor(
    @InjectModel(TextsModel)
    private readonly textsModel: ModelType<TextsModel>,
  ) {}

  async getAllTexts(): Promise<any> {
    return this.textsModel.find().exec();
  }

  async create(createTextDto: CreateTextDto): Promise<TextsModel> {
    return new this.textsModel(createTextDto).save();
  }

  async byCourse(
    courseId: Types.ObjectId,
  ): Promise<DocumentType<TextsModel>[]> {
    return this.textsModel.find({ course: courseId }).exec();
  }

  async getById(textId: Types.ObjectId): Promise<DocumentType<TextsModel>> {
    return this.textsModel.findById(textId).exec();
  }

  async getBySlug(slug: string): Promise<DocumentType<TextsModel>> {
    return this.textsModel.findOne({ slug }).exec();
  }

  async getByComplexity(
    complexity: number,
  ): Promise<DocumentType<TextsModel>[]> {
    console.log(complexity);
    return this.textsModel.find({ complexity: complexity }).exec();
  }
}
