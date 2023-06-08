import { prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { CoursesModel } from 'src/courses/courses.model';
import { ApiProperty } from '@nestjs/swagger';
import { UserModel } from 'src/user/user.model';
import { TextsModel } from 'src/texts/texts.model';
export interface DictionaryModel extends Base {}

export class DictionaryModel extends TimeStamps {
  @prop({ ref: UserModel, required: true })
  //@prop({ ref: () => CoursesModel })
  userId: Ref<UserModel>;

  @prop({ ref: () => CoursesModel })
  courseId: Ref<CoursesModel>;

  @ApiProperty({
    example: 'Level',
    description: 'Level of course where this word was',
  })

  /*
  @prop()
  level: string;
*/
  @prop({ ref: TextsModel, required: true })
  textId: Ref<TextsModel>;

  @prop({ unique: true, required: true })
  word: string;

  @prop({ required: true })
  translation: string;
}
