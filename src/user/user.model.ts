import { prop } from '@typegoose/typegoose';
import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses';
import { Role } from './enums/role.enum';

export interface UserModel extends Base {}

export class UserModel extends TimeStamps {
  @prop({ unique: true })
  email: string;

  @prop()
  password: string;

  @prop({ unique: true })
  username: string;
  //{ get: formatDate, set: parseDate }
  @prop({ get: formatDate, set: parseDate })
  birthdate: Date;

  /*@prop({ default: false })
  isAdmin?: boolean;*/

  @prop({ default: '/' })
  avatarURL?: string;

  @prop({ default: ['user'] })
  roles: Role[];
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function parseDate(dateString: string): Date {
  return new Date(dateString);
}
