import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll() {
    return this.userService.getUsers();
  }

  @Get('/avatar')
  async getUserAvatar(@Query('username') username: string) {
    return this.userService.getUserAvatar(username);
  }

  @Get(':username')
  async byUsername(@Param('username') username: string) {
    return this.userService.byUsername(username);
  }

  @Get('check-username/:username')
  async checkUsernameAvailability(@Param('username') username: string) {
    return this.userService.checkUsernameAvailability(username);
  }

  /*
  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  async update(@Param('id') id: string, @Body() dto: any) {
    const updateMovie = await this.userService.update(id, dto);
    if (!updateMovie) throw new NotFoundException('Movie not found');
    return updateMovie;
  }
*/

  @Post('/avatar')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('image'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Query('username') username: string,
  ): Promise<any> {
    return this.userService.uploadAvatar(file, username);
  }
}
