import {
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiOperation({ summary: 'Get all files from bucket' })
  @Get()
  async getAll() {
    return this.filesService.listBucketContents('videos-imvoraus');
  }

  @ApiOperation({ summary: 'Get file by name' })
  @Get('/file')
  async getFile() {
    return this.filesService.getFile('users/user2/avatar/1668768806143.jpg');
  }

  @ApiExcludeEndpoint()
  @Post('/image')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('username') username: string,
    @Query('subfolder') subfolder: string,
  ): Promise<any> {
    return this.filesService.uploadImage(file, username, subfolder);
  }
  @ApiOperation({ summary: 'upload image' })
  @Post('/image2')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile2(
    @UploadedFile() file: Express.Multer.File,
    @Query('username') username: string,
    @Query('subfolder') subfolder: string,
  ): Promise<any> {
    return this.filesService.uploadImage2(file, username, subfolder);
  }

  @Get('url/access')
  async getLinkMediaKey(@Query('key') key: string) {
    const url = await this.filesService.getLinkMediaKey(key);
    console.log(url);
    return { url: url };
  }
}
