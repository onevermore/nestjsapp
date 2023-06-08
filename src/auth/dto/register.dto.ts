import { IsString, MinLength, IsDate, IsDateString } from 'class-validator';

export class RegisterDto {
  @IsString()
  email: string;

  @MinLength(6, { message: 'Password cannot be less than 6 characters' })
  @IsString()
  password: string;

  @IsDateString()
  birthdate: Date;
}
