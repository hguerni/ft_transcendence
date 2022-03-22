import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDTO } from '../models/user.model';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post("updateUser")
  update(@Body(new ValidationPipe()) data: UpdateUserDTO) {
    return this.userService.updateUser(data);
  }
}