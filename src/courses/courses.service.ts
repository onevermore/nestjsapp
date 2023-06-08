import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { CrosswordService } from 'src/crossword/crossword.service';
import { FilesService } from 'src/files/files.service';
import { TextsService } from 'src/texts/texts.service';
import { UserService } from 'src/user/user.service';
import { CoursesModel, Niveau } from './courses.model';
import { CreateCourseDto } from './dto/create-course.dto';

export interface CourseData {
  courses: DocumentType<CoursesModel>[];
  total: number;
  totalPages: number;
  page: number;
}

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(CoursesModel)
    private readonly coursesModel: ModelType<CoursesModel>,
    private readonly textsService: TextsService,
    private readonly crosswordService: CrosswordService,
    private readonly userService: UserService,
    @Inject(FilesService)
    private s3Manager: FilesService, // @Inject(FilesService) //  private s3Manager: FilesService,
  ) {}

  async getAllCourses(
    searchTerm?: string,
    level?: string,
    page?: number,
    limit?: number,
  ): Promise<CourseData> {
    const queryCond = {
      ...(searchTerm && { title: new RegExp(searchTerm, 'i') }),
      ...(level && { level }),
    };

    const courses = await this.coursesModel
      .find(queryCond)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const total = await this.coursesModel.countDocuments().exec();

    if (!limit) limit = 10;
    const totalPages = Math.ceil(total / limit);

    return { courses, total, totalPages, page };
  }

  async getById(courseId: Types.ObjectId): Promise<DocumentType<CoursesModel>> {
    return this.coursesModel.findById({ id: courseId }).exec();
  }

  async getByUser(
    userId: Types.ObjectId,
  ): Promise<DocumentType<CoursesModel>[]> {
    return this.coursesModel.find({ ownerId: userId }).exec();
  }

  async createEmptyCourseId(): Promise<Types.ObjectId> {
    const defaultValue: CreateCourseDto = {
      title: '',
      slug: '',
      description: '',
      level: '',
      price: 0,
      isPublic: true,
      ownerId: '',
    };
    const course = await this.coursesModel.create(defaultValue);
    return course._id;
  }

  async create(createCourseDto: CreateCourseDto): Promise<CoursesModel> {
    // createCourseDto.price = Number(createCourseDto[price]);

    const { allowedUsers, level } = createCourseDto;
    if (!Object.values(Niveau).includes(level as Niveau)) {
      throw new BadRequestException('Invalid level value');
    }
    // Check if all usernames exist in User collection
    const users = await this.userService.findUsersByUsername(allowedUsers);
    const existingUsernames = users.map((user) => user.username);
    const missingUsernames = allowedUsers.filter(
      (username) => !existingUsernames.includes(username),
    );

    // Throw NotFound exception if any username is missing
    if (missingUsernames.length > 0) {
      throw new NotFoundException(
        `Users not found: ${missingUsernames.join(', ')}`,
      );
    }
    // collect users' data
    const usersData = users.map((user) => ({
      userId: user._id,
      username: user.username,
    }));

    const newCourseData = { ...createCourseDto, allowedUsers: usersData };

    return new this.coursesModel(newCourseData).save();
  }

  async bySlug(slug: string): Promise<any> {
    const courseBySlug = await this.coursesModel.findOne({ slug }).exec();

    const courseTexts = await this.textsService.byCourse(courseBySlug._id);
    const courseCrosswords = await this.crosswordService.byCourse(
      courseBySlug._id,
    );

    const result = {
      _id: String(courseBySlug._id),
      title: courseBySlug.title,
      level: courseBySlug.level,
      description: courseBySlug.description,
      texts: courseTexts,
      crosswords: courseCrosswords,
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

  async update(
    id: Types.ObjectId,
    dto: CreateCourseDto,
  ): Promise<DocumentType<CoursesModel> | null> {
    return this.coursesModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async delete(id: string): Promise<DocumentType<CoursesModel> | null> {
    return this.coursesModel.findByIdAndDelete(id).exec();
  }
}
