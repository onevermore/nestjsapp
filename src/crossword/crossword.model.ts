import { prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { CoursesModel } from 'src/courses/courses.model';

export interface CrosswordModel extends Base {}

export class Crossword {
  @prop()
  id: number;

  @prop()
  direction: string;

  @prop()
  clue: string;

  @prop()
  answer: string;

  @prop()
  row: number;

  @prop()
  col: number;
}

export class CrosswordModel extends TimeStamps {
  @prop()
  title: string;

  @prop()
  description: string;

  @prop()
  level: string;

  @prop()
  data: Crossword[];

  @prop({ default: 1 })
  complexity: number;

  @prop()
  slug: string;

  @prop({ ref: () => CoursesModel })
  course?: Ref<CoursesModel>;
}
