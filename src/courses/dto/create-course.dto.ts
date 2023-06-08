import { IsNumber, IsString, IsBoolean, IsArray } from 'class-validator';

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

  @IsArray()
  @IsString({ each: true })
  allowedUsers?: string[];

  @IsBoolean()
  isPublic: boolean;

  @IsString()
  ownerId: string;
}
