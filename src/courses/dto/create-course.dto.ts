import { IsNumber, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  level: string;

  @IsNumber()
  price: number;

  @IsString()
  slug: string;
}
