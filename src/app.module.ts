import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CoursesModule } from './courses/courses.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { getMongoConfig } from './config/mongo.config';
import { TextsModule } from './texts/texts.module';
import { VideosModule } from './videos/videos.module';
import { FilesModule } from './files/files.module';
import { AwsSdkModule } from 'nest-aws-sdk';
import { awsConfig } from './config/s3.config';
import { CrosswordModule } from './crossword/crossword.module';
import { APP_GUARD } from '@nestjs/core';
//import { RolesGuard } from './auth/guards/admin.guard2';
import { DictionaryController } from './dictionary/dictionary.controller';
import { DictionaryModule } from './dictionary/dictionary.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),

    AwsSdkModule.forRootAsync({
      defaultServiceOptions: {
        useFactory: awsConfig,
        imports: [ConfigModule],
        inject: [ConfigService],
      },
    }),

    FilesModule,
    AuthModule,
    UserModule,
    TextsModule,
    CoursesModule,
    VideosModule,
    CrosswordModule,
    DictionaryModule,
  ],
  controllers: [DictionaryController],
  providers: [
    /*  {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },*/
  ],
})
export class AppModule {}
