import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  UseInterceptors,
  ValidationPipe,
  UploadedFile
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UpdateUserDTO } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';

@Controller('user')
export class UserController {
  constructor(private userService: UserService, private authService : AuthService) {}

  @Get()
  async findAll(){
    return await this.userService.findAll();
  }

  @Get("name/:param")
  async searchUser(@Param('param') param) {
    return await this.userService.findByUserName(param);
  }

  @Get(":id")
  async getProfile(@Param('id', new ParseIntPipe()) id) {
    return await this.userService.getById(id);
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

  uploadFile(@UploadedFile() file) {
      return { url: `http://54.245.74.93:3030/uploads/${file.filename}`}
  }

  @Post("updateUser")
  async update(@Body(new ValidationPipe()) data: UpdateUserDTO) {
    return await this.userService.updateUser(data);
  }
}
