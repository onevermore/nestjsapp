import { IsString, MinLength, IsDateString } from 'class-validator';

export class RegisterDto {
  @IsString()
  email: string;

  @MinLength(3, { message: 'Password cannot be less than 3 characters' })
  @IsString()
  username: string;

  @MinLength(6, { message: 'Password cannot be less than 6 characters' })
  @IsString()
  password: string;

  @IsDateString()
  birthdate: Date;
}
