import { prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { UserModel } from 'src/user/user.model';

export class UserData {
  @prop()
  userId: Ref<UserModel>;

  @prop()
  username: string;
}

export enum Niveau {
  'A1' = 'A1',
  'A2' = 'A2',
  'B1' = 'B1',
  'B2' = 'B2',
  'C1' = 'C1',
  'C2' = 'C2',
}

export interface CoursesModel extends Base {}

export class CoursesModel extends TimeStamps {
  @prop({ required: true })
  title: string;

  @prop({ unique: true, required: true, trim: true })
  slug: string;

  @prop()
  description: string;

  @prop({ enum: Niveau })
  level: Niveau;

  @prop({ default: 0 })
  price: number;

  @prop({ _id: false })
  allowedUsers?: UserData[];

  @prop({ default: true })
  isPublic: boolean;

  @prop({ ref: () => UserModel })
  ownerId: Ref<UserModel>;
}
