import { Inject, Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { FilesService } from 'src/files/files.service';
import { UserModel } from './user.model';
const sharp = require('sharp');

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
    @Inject(FilesService) private s3Manager: FilesService,
  ) {}

  async getUsers(): Promise<any> {
    return this.userModel.find().exec();
  }

  async byUsername(username: string): Promise<any> {
    const userByUsername = await this.userModel.findOne({ username }).exec();
    return userByUsername;
  }
  /*
	async update(
		id: string,
		dto: CreateMovieDto
	): Promise<DocumentType<any> | null> {
		return this.movieModel.findByIdAndUpdate(id, dto, { new: true }).exec()
	}
*/
  async uploadAvatar(
    file: Express.Multer.File,
    username: string,
  ): Promise<any> {
    const buffer = await sharp(file.buffer)
      .resize({ height: 300, width: 300, fit: 'contain' })
      .toBuffer();

    const imageData = await this.s3Manager.uploadImage(
      file,
      username,
      'avatar',
    );
    this.userModel
      .updateOne(
        { username },
        { $set: { avatarURL: imageData?.url } },
        { new: true },
      )
      .exec();
    return imageData;
  }
  //getUserAvatar
  async getUserAvatar(username: string): Promise<any> {
    const userImageURL = await this.userModel
      .findOne({ username })
      .select({ _id: 0, avatarURL: 1 })
      .exec();
    console.log(userImageURL);
    return userImageURL;
  }
}
