import { All, Injectable, NotFoundException } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { ChatEntity, chat_status } from "../entities/chat.entity";
import { AddMemberDTO, ChatDTO } from "../models/chat.model";
import { createQueryBuilder, EntityManager, Repository } from "typeorm";
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
        // const member1: AddMemberDTO =  {
        //     channel: chat_result.id,
        //     userId: (await this.getUser(login1)).login
        // };
        // const member2: AddMemberDTO =  {
        //     channel: chat_result.id,
        //     userId: (await this.getUser(login2)).login
        // }
        // await this.addMember(member1);
        // await this.addMember(member2);
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
        const members = await this.membersRepo.find({where: {user: user}, relations: ['chat', 'chat.messages', 'chat.messages.member']});
        return members;
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
        const member = await this.membersRepo.findOne(data.userId);
        const message = this.msgRepo.create({"member": member, "message": data.message, "chat": chat});
        chat.messages.push(message);
        await this.chatRepository.save(chat).catch((e) => console.log(e));
        const resu2 = await this.msgRepo.save(message).catch((e) => console.log(e));
        return resu2;
    }

    async memberInChannel(name: string)
    {
        const chat = await this.chatRepository.findOne({select: ["members"], where: {name: name}, relations: ['members', 'members.user']});
        console.log(chat);
        const result = [];
        chat.members.forEach(member => {
            result.push(member.user.login);
        });
        return result;

    }

    async addMember(data: AddMemberDTO)
    {
        const chat = await this.chatRepository.findOne({where: {name: data.channel}});
        if (!chat)
            throw new NotFoundException();
        const user = await this.userRepo.findOne({where: {login: data.login}});
        if (!user)
            throw new NotFoundException();
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