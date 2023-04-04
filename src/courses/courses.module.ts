import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { CoursesModel } from './courses.model';
import { UserModule } from 'src/user/user.module';
import { TextsModule } from 'src/texts/texts.module';
import { FilesModule } from 'src/files/files.module';
import { CrosswordModule } from 'src/crossword/crossword.module';

@Module({
  controllers: [CoursesController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: CoursesModel,
        schemaOptions: {
          collection: 'Courses',
        },
      },
    ]),
    UserModule,
    TextsModule,
    FilesModule,
    CrosswordModule,
  ],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
