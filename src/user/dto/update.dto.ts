import { IsEmail, IsString } from 'class-validator';

export class UpdateDto {
  @IsEmail()
  email: string;

  @IsString()
  password?: string;

  @IsString()
  avatarURL?: string;

  isAdmin?: boolean;
}
