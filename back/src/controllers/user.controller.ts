import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
  UploadedFile
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UpdateUserDTO } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private userService: UserService, private authService : AuthService) {}

  @Get()
  async findAll(){
    return this.userService.findAll();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image', {
      storage: diskStorage({
          destination: './uploads',
          filename(_, file, callback) {
              return callback(null, `${file.originalname}`);
          }
      })
  }))

  // @Post('avatar')
  // @UseInterceptors(FileInterceptor('file'))
  // async addAvatar(@Req() req, @UploadedFile() file: diskStorage.File) {
  //   const clientID = await this.authService.clientID(req);
  //   return this.userService.addAvatar(clientID, file.buffer, file.originalname);
  // }

  uploadFile(@UploadedFile() file) {
      return { url: `http://localhost:3030/uploads/${file.filename}`}
  }

  @Post("updateUser")
  update(@Body(new ValidationPipe()) data: UpdateUserDTO) {
    return this.userService.updateUser(data);
  }
}
