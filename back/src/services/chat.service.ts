import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChatEntity } from "../entities/chat.entity";
import { ChatDTO } from "../models/chat.model";
import { Repository } from "typeorm";

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatEntity)
        private chatRepository: Repository<ChatEntity>,
      ) {}
    
    async addOne(data: ChatDTO){
        return await this.chatRepository.save(data); 
    }

    async getAll(): Promise<ChatEntity[]>{
        return await this.chatRepository.find();
    }
}