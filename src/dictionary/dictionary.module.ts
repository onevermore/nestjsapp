import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModule } from 'src/user/user.module';
import { DictionaryController } from './dictionary.controller';
import { DictionaryModel } from './dictionary.model';
import { DictionaryService } from './dictionary.service';

@Module({
  providers: [DictionaryService],
  controllers: [DictionaryController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: DictionaryModel,
        schemaOptions: {
          collection: 'Dictionary',
        },
      },
    ]),
    UserModule,
  ],
  exports: [DictionaryService],
})
export class DictionaryModule {}
