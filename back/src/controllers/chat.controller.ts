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

import { ChatService } from '../services/chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get()
  async getchannels(){
    return await this.chatService.getAll();
  }

  @Get()
  async getpvchannels(){
    return await this.chatService.getPvmsg("psemsari");
  }
}