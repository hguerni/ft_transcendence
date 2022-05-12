import { Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { ChatEntity, chat_status } from "../entities/chat.entity";
import { AddMemberDTO, ChatDTO } from "../models/chat.model";
import { EntityManager, Repository } from "typeorm";
import { MsgEntity } from "../entities/msg.entity";
import { MemberEntity } from "../entities/member.entity";
import { MsgDTO } from "../models/chat.model";
import { UserEntity } from "../entities/user.entity";
import { getgroups } from "process";
import { getHeapCodeStatistics } from "v8";

enum status {
    owner,
    admin,
    modo,
    ban,
    default
  }

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatEntity)
        private chatRepository: Repository<ChatEntity>,
        @InjectRepository(MsgEntity)
        private msgRepo: Repository<MsgEntity>,
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>,
        @InjectRepository(MemberEntity)
        private membersRepo: Repository<MemberEntity>,
        @InjectEntityManager()
        private manager: EntityManager
      ) {}
    
    async pvmsg_init(login1: string, login2:string)
    {
        const name: string = "pv-" + login1 + login2;
        const chat: ChatDTO = {
            name: name,
            status: chat_status.private,
            password: ""
        }
        await this.addOne(chat);
        const chat_result: ChatEntity = await this.getChat(name);
        const member1: AddMemberDTO =  {
            chatId: chat_result.id,
            userId: (await this.getUser(login1)).login
        };
        const member2: AddMemberDTO =  {
            chatId: chat_result.id,
            userId: (await this.getUser(login2)).login
        }
        await this.addMember(member1);
        await this.addMember(member2);
    }

    async getChat(name: string)
    {
        return await this.chatRepository.findOne(name);
    }

    // {login: psemsari,
    // group: {name, message:[]}}

    // {group: name,
    // mess}
    async getPvmsg(login: string)
    {
        const user = await this.userRepo.findOne({where: {login: login}});
        console.log(user);
        const members = await this.membersRepo.find({select: ['id', 'chat'], where: {user: user}, relations: ['chat']});
        console.log(members);
        const chat = await this.manager.createQueryBuilder()
        .from(UserEntity, "user")
        .addFrom(MemberEntity, "member");
        // const chat = await this.chatRepository.createQueryBuilder("chat")
        //     .leftJoinAndSelect("chat.members", "members")
        //     .where("members = :mb", {members})
        //     .getManyAndCount();
        console.log(chat[0]);
    }

    async getUser(name: string)
    {
        return await this.userRepo.findOne(name);
    }

    async addOne(data: ChatDTO){

        const chat = this.chatRepository.create({...data, messages: []});
        console.log(chat);
        return await this.chatRepository.save(chat);
    }

    async addMsg(data: MsgDTO){
        const chat = await this.chatRepository.findOne(data.chatId, {relations: ["messages"]});
        const message = this.msgRepo.create({ "message": data.message, "chat": chat});
        chat.messages.push(message);
        await this.chatRepository.save(chat);
        return await this.msgRepo.save(message);
    }

    async addMember(data: AddMemberDTO)
    {
        const chat = await this.chatRepository.findOne(data.chatId);
        const user = await this.userRepo.findOne(data.userId);
        const member = this.membersRepo.create({user: user, status: status.default, mute: false, chat: chat});
        return await this.membersRepo.save(member);
    }
    
    async getMsg(data: number){
        const chat = await this.chatRepository.findOne(data, {relations: ["messages"]});
        return chat.messages;
    }

    async getAll(): Promise<ChatEntity[]>{
        return await this.chatRepository.find();
    }
}