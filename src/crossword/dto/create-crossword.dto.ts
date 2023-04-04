import { IsNumber, IsString, IsObject, IsArray } from 'class-validator';

export class CrosswordData2 {
  @IsNumber()
  id: number;

  @IsString()
  direction: string;

  @IsString()
  clue: string;

  @IsString()
  answer: string;

  @IsNumber()
  row: number;

  @IsNumber()
  col: number;
}

export class CrosswordParameters {
  @IsObject()
  across: number;

  @IsObject()
  down: number;
}

export class CreateCrosswordDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  level: string;

  @IsArray()
  @IsObject({ each: true })
  data: CrosswordData2[];

  @IsNumber()
  complexity: number;

  @IsString()
  slug: string;

  @IsString()
  course: string;
}
