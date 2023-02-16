import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateTextDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsString()
  description: string;

  @IsString()
  text: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  complexity: number;

  @IsString()
  course: string;
}
