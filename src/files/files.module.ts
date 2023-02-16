import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';

@Module({
  providers: [FilesService],
  controllers: [FilesController],
  exports: [FilesService],
  imports: [AwsSdkModule.forFeatures([S3])],
})
export class FilesModule {}
