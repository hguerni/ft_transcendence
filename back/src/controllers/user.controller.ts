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

  @Get("ft/:id")
  async getFtProfile(@Param('id', new ParseIntPipe()) id) {
    return await this.userService.findByFtId(id);
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
      return { url: `http://localhost:3030/uploads/${file.filename}`}
  }

  @Post("updateUser")
  async update(@Body(new ValidationPipe()) data: UpdateUserDTO) {
    return await this.userService.updateUser(data);
  }
  @Get("games/:id")
  async Game(@Param('id') id) {
      console.log("game " + id);
      const clientID = await this.userService.findByFtId(id);
      console.log(clientID);
      let games = await this.userService.getGames(clientID.ft_id);
      return (games)
  }

  @Get("stats/:id")
  async Stats(@Param('id') id) {
      console.log("stats " + id);
      const clientID = await this.userService.findByFtId(id);
      console.log(clientID);
      let stats = await this.userService.getStats(clientID.ft_id);
      //console.log(stats);
      return (stats);
  }
}
