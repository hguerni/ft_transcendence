import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChatEntity } from "src/entities/chat.entity";
import { Repository } from "typeorm";

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatEntity)
        private chatRepository: Repository<ChatEntity>,
      ) {}
    
    async addOne(data: ChatEntity){
        return await this.chatRepository.save(data); 
    }
}