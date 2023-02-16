import { prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface CoursesModel extends Base {}

/*
export class Dictionary {
  @prop()
  word: string;

  @prop()
  translation: string;
}
*/
export class CoursesModel extends TimeStamps {
  @prop()
  title: string;

  @prop()
  slug: string;

  @prop()
  description: string;

  @prop()
  level: string;

  @prop({ default: 0 })
  price: number;

  // @prop({ default: [] })
  // dictionary: Dictionary;
}
