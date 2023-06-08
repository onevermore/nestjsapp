import { IsNotEmpty, IsString } from 'class-validator';

export class AddWordToDictionaryDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  courseId: string;
  /*
  @IsNotEmpty()
  @IsString()
  level: string;
*/
  @IsNotEmpty()
  @IsString()
  textId: string;

  @IsNotEmpty()
  @IsString()
  word: string;

  @IsNotEmpty()
  @IsString()
  translation: string;
}
