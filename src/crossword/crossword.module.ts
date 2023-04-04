import { Module } from '@nestjs/common';
import { CrosswordService } from './crossword.service';
import { CrosswordController } from './crossword.controller';
import { UserModule } from 'src/user/user.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { CrosswordModel } from './crossword.model';

@Module({
  providers: [CrosswordService],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: CrosswordModel,
        schemaOptions: {
          collection: 'Crosswords',
        },
      },
    ]),
    UserModule,
  ],
  controllers: [CrosswordController],
  exports: [CrosswordService],
})
export class CrosswordModule {}
