import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChatEntity } from "../entities/chat.entity";
import { AddMemberDTO, ChatDTO } from "../models/chat.model";
import { Repository } from "typeorm";
<<<<<<< Updated upstream
import { MsgEntity } from "../entities/msg.entity";
import { MsgDTO } from "../models/chat.model";
=======
<<<<<<< Updated upstream
=======
import { MsgEntity } from "../entities/msg.entity";
import { MemberEntity } from "../entities/member.entity";
import { MsgDTO } from "../models/chat.model";
import { UserEntity } from "../entities/user.entity";

enum status {
    owner,
    admin,
    modo,
    ban,
    default
  }
>>>>>>> Stashed changes
>>>>>>> Stashed changes

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatEntity)
        private chatRepository: Repository<ChatEntity>,
<<<<<<< Updated upstream
        @InjectRepository(MsgEntity)
        private msgRepo: Repository<MsgEntity>
      ) {}
    
    async addOne(data: ChatDTO){

        const chat = this.chatRepository.create({...data, "messages": []});
        console.log(chat);
        return await this.chatRepository.save(chat);
=======
<<<<<<< Updated upstream
      ) {}
    
    async addOne(data: ChatDTO){
        return await this.chatRepository.save(data); 
=======
        @InjectRepository(MsgEntity)
        private msgRepo: Repository<MsgEntity>,
        @InjectRepository(MemberEntity)
        private memberRepo: Repository<MemberEntity>,
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>
      ) {}
    
    async addOne(data: ChatDTO){

        const chat = this.chatRepository.create({...data, "messages": [], members: [] });
        console.log(chat);
        try {
        return await this.chatRepository.save(chat);
            
        } catch (error) {
            return error;
        }
    }

    async addMember(data: AddMemberDTO){
        const chat = await this.chatRepository.findOne(data.chatId, {relations: ["members"]});
        console.log(chat);
        const user = await this.userRepo.findOne(data.userId);
        console.log(2);
        const member = this.memberRepo.create({
            user: user,
            status: status.default,
            mute: false
        });
        console.log(3);
        try {chat.members.push(member)}
        catch (e) { console.log(e); }
        console.log(4);
        await this.chatRepository.save(chat);
        console.log(5);
        return await this.memberRepo.save(member);
>>>>>>> Stashed changes
    }

    async addMsg(data: MsgDTO){
        const chat = await this.chatRepository.findOne(data.chatId, {relations: ["messages"]});
<<<<<<< Updated upstream
        const message = this.msgRepo.create({ "message": data.message, "chat": chat});
=======
        const member = await this.memberRepo.findOne(data.userId);
        const message = this.msgRepo.create({ "message": data.message, "chat": chat, "member": member});
>>>>>>> Stashed changes
        chat.messages.push(message);
        await this.chatRepository.save(chat);
        return await this.msgRepo.save(message);
    }

    async getMsg(data: number){
        const chat = await this.chatRepository.findOne(data, {relations: ["messages"]});
        return chat.messages;
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
>>>>>>> Stashed changes
    }

    async getAll(): Promise<ChatEntity[]>{
        return await this.chatRepository.find();
    }
}