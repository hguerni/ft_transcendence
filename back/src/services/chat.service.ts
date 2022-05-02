import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChatEntity } from "../entities/chat.entity";
import { ChatDTO } from "../models/chat.model";
import { Repository } from "typeorm";
import { MsgEntity } from "../entities/msg.entity";
import { MsgDTO } from "../models/chat.model";

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatEntity)
        private chatRepository: Repository<ChatEntity>,
        @InjectRepository(MsgEntity)
        private msgRepo: Repository<MsgEntity>
      ) {}
    
    async addOne(data: ChatDTO){

        const chat = this.chatRepository.create(data);
        return await this.chatRepository.save(chat);
    }

    async addMsg(data: MsgDTO){
        const message = this.msgRepo.create(data);
        const chat = await this.chatRepository.findOne(data.chatId);
        chat.messages.push(message);
        this.chatRepository.save(chat);
        return await this.msgRepo.save(message);
    }

    async getMsg(data: number){
        return await (await this.chatRepository.findOneOrFail(data)).messages;
    }

    async getAll(): Promise<ChatEntity[]>{
        return await this.chatRepository.find();
    }
}