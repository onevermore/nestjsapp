import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { CoursesService } from 'src/courses/courses.service';
import { CreateTextDto } from './dto/create-text.dto';
import { TextsModel } from './texts.model';

@Injectable()
export class TextsService {
  constructor(
    @InjectModel(TextsModel)
    private readonly textsModel: ModelType<TextsModel>, // @Inject(forwardRef(() => CoursesService)) // private readonly courseService: CoursesService,
  ) {}

  async getAllTexts(page = 1, limit = 10): Promise<any> {
    const texts = await this.textsModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const total = await this.textsModel.countDocuments().exec();
    const totalPages = Math.ceil(total / limit);
    return { texts, total, totalPages, page };
    // return this.textsModel.find().exec();
  }

  async create(createTextDto: CreateTextDto): Promise<TextsModel> {
    return new this.textsModel(createTextDto).save();
  }

  async byCourse(
    courseId: Types.ObjectId,
  ): Promise<DocumentType<TextsModel>[]> {
    return this.textsModel.find({ course: courseId }).exec();
  }
  /*
  async byCourse(
    courseSlug: string,
  ): Promise<DocumentType<TextsModel>[]> {
    return this.textsModel.find({ course: courseId }).exec();
  }
*/
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

  async update(
    id: string,
    dto: CreateTextDto,
  ): Promise<DocumentType<TextsModel> | null> {
    return this.textsModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async delete(id: string): Promise<DocumentType<TextsModel> | null> {
    return this.textsModel.findByIdAndDelete(id).exec();
  }
}
