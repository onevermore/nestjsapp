import { Module } from '@nestjs/common';
import { TextsService } from './texts.service';
import { TextsController } from './texts.controller';
import { TextsModel } from './texts.model';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [TextsController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: TextsModel,
        schemaOptions: {
          collection: 'Texts',
        },
      },
    ]),
    UserModule,
  ],
  providers: [TextsService],
  exports: [TextsService],
})
export class TextsModule {}
