import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
  }

  async checkUsernameAvailability(
    username: string,
  ): Promise<{ available: boolean }> {
    const user = await this.userModel.findOne({ username }).exec();
    //  if (userByUsername) throw new NotFoundException(`Username already exists`);

    return { available: !user };
  }

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

  async checkUsernamesExist(usernames: string[]): Promise<void> {
    const users = await this.userModel
      .find({ username: { $in: usernames } })
      .exec();
    const existingUsernames = users.map((user) => user.username);

    const missingUsernames = usernames.filter(
      (username) => !existingUsernames.includes(username),
    );
    if (missingUsernames.length > 0) {
      const missingUsernamesString = missingUsernames.join(', ');
      throw new NotFoundException(`Users not found: ${missingUsernamesString}`);
    }
  }

  async findUsersByUsername(
    usernames: string[],
  ): Promise<DocumentType<UserModel>[]> {
    return this.userModel.find({ username: { $in: usernames } }).exec();
  }
}
