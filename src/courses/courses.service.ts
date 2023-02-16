import { Inject, Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { FilesService } from 'src/files/files.service';
import { TextsService } from 'src/texts/texts.service';
import { CoursesModel } from './courses.model';
import { CreateCourseDto } from './dto/create-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(CoursesModel)
    private readonly coursesModel: ModelType<CoursesModel>,
    private readonly textsService: TextsService,
    @Inject(FilesService)
    private s3Manager: FilesService,
  ) // @Inject(FilesService) //  private s3Manager: FilesService,
  {}

  async getCourses(): Promise<any> {
    return this.coursesModel.find().exec();
  }

  async create(): Promise<Types.ObjectId> {
    const defaultValue: CreateCourseDto = {
      title: '',
      slug: '',
      description: '',
      level: '',
      price: 0,
    };
    const course = await this.coursesModel.create(defaultValue);
    return course._id;
  }

  async bySlug(slug: string): Promise<any> {
    const courseBySlug = await this.coursesModel.findOne({ slug }).exec();

    const courseTexts = await this.textsService.byCourse(courseBySlug._id);

    const textsInfo = courseTexts.map((text) => ({
      title: text.title,
      slug: text.slug,
      description: text.description,
      text: text.text,
      complexity: text.complexity,
    }));

    const result = {
      _id: String(courseBySlug._id),
      title: courseBySlug.title,
      description: courseBySlug.description,
      texts: textsInfo,
    };
    return result;
  }

  async createe(): Promise<any> {
    const user = {
      id: 'user2',
      name: 'myname2',
    };
    await this.s3Manager.upload(
      process.env.AWS_PUBLIC_BUCKET_KEY,
      `users/${user.id}/${user.id}.json`,
      JSON.stringify(user),
    );
    return user;
  }
}
