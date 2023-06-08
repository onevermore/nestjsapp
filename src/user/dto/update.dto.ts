import {
  IsArray,
  IsEmail,
  IsString,
  IsDate,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { Role } from '../enums/role.enum';

export class UpdateDto {
  @IsEmail()
  email: string;

  @IsString()
  password?: string;

  @IsString()
  avatarURL?: string;

  /* @IsBoolean()
  isAdmin?: boolean;
*/
@IsDateString()
  birthdate: Date;

  @IsArray()
  roles: Role[];
}
