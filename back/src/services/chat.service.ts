import { All, Injectable, NotFoundException } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { ChatEntity, chat_status } from "../entities/chat.entity";
import { AddMemberDTO, ChatDTO } from "../models/chat.model";
import { createQueryBuilder, EntityManager, MetadataAlreadyExistsError, Repository } from "typeorm";
import { MsgEntity } from "../entities/msg.entity";
import { MemberEntity } from "../entities/member.entity";
import { MsgDTO } from "../models/chat.model";
import { UserEntity } from "../entities/user.entity";
import { getgroups } from "process";
import { getHeapCodeStatistics } from "v8";
import { Console } from "console";

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
        const channels = await this.membersRepo.find({select: ['id'], where: {user: user}, relations: ['chat']});

        const tmp: string[] = [];
        channels.forEach((element) => {
            tmp.push(element.chat.name);
        })
        return tmp;
    }

    async getUser(name: string)
    {
        return await this.userRepo.findOne(name);
    }

    async addOne(data: ChatDTO){

        const chat = this.chatRepository.create({...data, messages: [], members: []});
        return await this.chatRepository.save(chat);
    }

    async addMsg(data: MsgDTO){
        console.log(data);
        const chat = await this.chatRepository.findOne({where:{name: data.channel}, relations: ["messages"]});
        console.log(2);
        const user = await this.userRepo.findOne({where: {login: data.login}});
        console.log(3);
        const member = await this.membersRepo.findOne({where: {user: user, chat: chat}, relations: ['chat', 'chat.messages']});
        console.log(4);
        const message = this.msgRepo.create({"member": member, "message": data.message, "chat": chat});
        console.log(5);
        chat.messages.push(message);
        console.log(6);
        await this.chatRepository.save(chat).catch((e) => console.log(e));
        console.log(7);
        const resu2 = await this.msgRepo.save(message).catch((e) => console.log(e));
        console.log(8);
        return resu2;
    }

    async memberInChannel(name: string)
    {
        const chat = await this.chatRepository.findOne({select: ["id"], where: {name: name}, relations: ['members', 'members.user']});
        const tmp: string[] = [];
        chat.members.forEach((element) => {
            tmp.push(element.user.login);
        })
        return tmp;
    }

    async messageInChannel(name: string)
    {
        const chat = await this.chatRepository.findOne({select: ["id"], where: {name: name}, relations: ['messages', 'messages.member', 'messages.member.user']});
        const tmp: {name: string, message: string}[] = [];
        chat.messages.forEach((element) => {
            tmp.push({name: element.member.user.login, message: element.message});
        })
        return tmp;
    }

    async addMember(data: AddMemberDTO)
    {
        const chat = await this.chatRepository.findOne({where: {name: data.channel}});
        if (!chat)
            throw new NotFoundException();
        const user = await this.userRepo.findOne({where: {login: data.login}});
        if (!user)
            throw new NotFoundException();
        const same = await this.membersRepo.findOne({where: {user: user, chat: chat}});
        if (same)
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
