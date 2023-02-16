import { prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { CoursesModel } from 'src/courses/courses.model';
import { ApiProperty } from '@nestjs/swagger';
export interface TextsModel extends Base {}

export class TextsModel extends TimeStamps {
  @ApiProperty({ example: 'My title', description: 'The age of the Cat' })
  @prop()
  title: string;

  @prop()
  slug: string;

  @prop()
  description: string;

  @prop()
  text: string;

  @prop({ default: 1 })
  complexity: number;

  @prop({ ref: () => CoursesModel })
  course: Ref<CoursesModel>;
}
