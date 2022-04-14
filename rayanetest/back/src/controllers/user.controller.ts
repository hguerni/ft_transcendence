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
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

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
  uploadFile(@UploadedFile() file) {
      return { url: `http://localhost:3000/api/uploads/${file.filename}`}
  }

  @Post("updateUser")
  update(@Body(new ValidationPipe()) data: UpdateUserDTO) {
    return this.userService.updateUser(data);
  }
}