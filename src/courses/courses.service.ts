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
import { v4 as uuidv4 } from 'uuid';
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

    const total = await this.coursesModel.countDocuments(queryCond).exec();

    if (!limit) limit = 10;
    let totalPages = Math.ceil(total / limit);
    if (totalPages === 0) totalPages = 1;

    return { courses, total, totalPages, page };
  }

  async getById(courseId: Types.ObjectId): Promise<any> {
    const courseById = await this.coursesModel
      .findById({ _id: courseId })
      .exec();

    const courseTexts = await this.textsService.byCourse(courseById._id);
    const courseCrosswords = await this.crosswordService.byCourse(
      courseById._id,
    );

    const result = {
      _id: String(courseById._id),
      title: courseById.title,
      level: courseById.level,
      description: courseById.description,
      texts: courseTexts,
      crosswords: courseCrosswords,
    };
    return result;
  }

  async getByUser(
    userId: Types.ObjectId,
  ): Promise<DocumentType<CoursesModel>[]> {
    return this.coursesModel.find({ ownerId: userId }).exec();
  }

  async findBySlug(slug: string): Promise<DocumentType<CoursesModel>> {
    return this.coursesModel.findOne({ slug }).exec();
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

    let { allowedUsers, slug, ...courseData } = createCourseDto;

    const existingSlug = await this.findBySlug(slug);
    if (existingSlug) {
      // If the slug exists, append a unique ID or a random string to make it unique
      const uniqueId = uuidv4(); // Generate a unique ID using UUID library
      slug += `-${uniqueId}`;
    }

    if (!Object.values(Niveau).includes(courseData.level as Niveau)) {
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
    const usersData = users?.map((user) => ({
      userId: user._id,
      username: user.username,
    }));

    const newCourseData = {
      ...courseData,
      ...(!courseData.isPublic && { allowedUsers: usersData }),
      slug,
    };

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
