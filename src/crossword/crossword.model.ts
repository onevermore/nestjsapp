import { prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { CoursesModel } from 'src/courses/courses.model';

export interface CrosswordModel extends Base {}

export class CrosswordData {
  @prop()
  clue: string;

  @prop()
  answer: string;

  @prop()
  row: number;

  @prop()
  col: number;
}

export class Crossword {
  @prop()
  across: CrosswordData;

  @prop()
  down: CrosswordData;
}

export class CrosswordModel extends TimeStamps {
  @prop()
  title: string;

  @prop()
  slug: string;

  @prop()
  description: string;

  @prop()
  data: Crossword;

  @prop()
  level: string;

  @prop({ default: 1 })
  complexity: number;

  @prop({ ref: () => CoursesModel, default: 'all' })
  course?: Ref<CoursesModel> | 'all';
}
