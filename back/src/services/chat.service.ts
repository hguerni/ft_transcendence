import { All, Injectable, NotFoundException } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { ChatEntity, chat_status } from "../entities/chat.entity";
import { AddMemberDTO, ChatDTO } from "../models/chat.model";
import { createQueryBuilder, EntityManager, MetadataAlreadyExistsError, Not, Repository } from "typeorm";
import { MsgEntity } from "../entities/msg.entity";
import { MemberEntity, quit_status } from "../entities/member.entity";
import { MsgDTO } from "../models/chat.model";
import { UserEntity } from "../entities/user.entity";
import { getgroups } from "process";
import { getHeapCodeStatistics } from "v8";
import { Console, error } from "console";
import { LoginDTO } from "src/models/user.model";

export enum status {
    owner,
    admin,
    default,
    ban
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

    async getChat(name: string)
    {
        return await this.chatRepository.findOne({where: {name: name}});
    }

    async getPvmsg(id: number)
    {
        const user = await this.userRepo.findOne({where: {ft_id: id}});
        const channels = await this.membersRepo.find({select: ['id', 'quit_status'], where: {user: user}, relations: ['chat']});

        const tmp: string[] = [];
        channels.forEach((element) => {
            if (element.quit_status == quit_status.none)
                tmp.push(element.chat.name);
        })
        return tmp;
    }

    async getUser(id: number)
    {
        return await this.userRepo.findOne({where: {ft_id: id}});
    }

    async addOne(data: ChatDTO){
        console.log(data);
        const chat = this.chatRepository.create({...data, messages: [], members: [], mp_message: false});
        return await this.chatRepository.save(chat);
    }

    async defineMp(channel: string)
    {
        const chat = await this.chatRepository.findOne({where:{name: channel}});
        chat.mp_message = true;
        this.chatRepository.save(chat);
    }

    async Mute(data: {channel: string, target: number, sender: number})
    {
        const chat = await this.chatRepository.findOne({where:{name: data.channel}});
        const tomute = await this.getMember(chat, data.target);
        const send = await this.getMember(chat, data.sender);
        if (send.status > status.admin || tomute.status < send.status)
            throw Error("No privilege");
        tomute.mute = true;
        this.membersRepo.save(tomute);
    }

    async unMute(data: {channel: string, target: number, sender: number})
    {
        const chat = await this.chatRepository.findOne({where:{name: data.channel}});
        const tomute = await this.getMember(chat, data.target);
        const send = await this.getMember(chat, data.sender);
        tomute.mute = false;
        this.membersRepo.save(tomute);
    }

    async Quit(data: {channel: string, id: number})
    {
        const chat = await this.chatRepository.findOne({where:{name: data.channel}});
        const membre = await this.getMember(chat, data.id);
        membre.quit_status = quit_status.quit;
        if (membre.status == status.owner)
        {
            try {
                const member = await this.membersRepo.findOne({where: {chat: chat, status: Not(status.owner), quit_status: 0}, relations: ['user']});
                member.status = status.owner;
                this.changeStatus({channel: data.channel, target: member.user.ft_id, sender: data.id, status: 0});
                console.log(member.user);
            }
            catch (e) { console.log(e);}
        }
        return this.membersRepo.save(membre);
    }

    async addMsg(data: MsgDTO){
        const chat = await this.chatRepository.findOne({where:{name: data.channel}, relations: ["messages"]});
        const user = await this.userRepo.findOne({where: {ft_id: data.id}});
        const member = await this.membersRepo.findOne({where: {user: user, chat: chat}, relations: ['chat', 'chat.messages']});
        console.log(member.mute);
        if (member.mute || member.quit_status > quit_status.none)
            throw Error("is mute, quit or ban");
        const message = this.msgRepo.create({"member": member, "message": data.message, "chat": chat});
        chat.messages.push(message);
        await this.chatRepository.save(chat).catch((e) => console.log(e));
        const resu2 = await this.msgRepo.save(message).catch((e) => console.log(e));
        return resu2;
    }

    async memberInChannel(name: string)
    {
        const chat = await this.chatRepository.findOne({select: ["id"], where: {name: name}, relations: ['members', 'members.user']});
        const tmp: {id: number, name: string, status: number}[] = [];
        chat.members.forEach((element) => {
            if (element.quit_status == quit_status.none)
                tmp.push({id: element.user.ft_id, name: element.user.username, status: element.status});
        })
        return tmp;
    }

    async messageInChannel(name: string)
    {
        const chat = await this.chatRepository.findOne({select: ["id"], where: {name: name}, relations: ['messages', 'messages.member', 'messages.member.user']});
        const tmp: {id: number, name: string, message: string}[] = [];
        chat.messages.forEach((element) => {
            tmp.push({id: element.member.user.ft_id, name: element.member.user.username, message: element.message});
        })
        return tmp;
    }

    async getAccessibleChan(id: number)
    {
        // const user = await this.userRepo.findOne({where: {ft_id: id}});
        // const channels = await this.membersRepo.find({select: ['id', 'quit_status'], where: {user: user}, relations: ['chat']});

        // const tmp: string[] = [];
        // channels.forEach((element) => {
        //     if (element.quit_status == quit_status.none)
        //         tmp.push(element.chat.name);
        // })
        // return tmp;

        // const user = await this.userRepo.findOne({where: {ft_id: id}});
        // const member = await this.membersRepo.find({select: ['id'], relations: ['chat']});

        // const chat: {name: string, status: number}[] = [];
        // member.forEach((element) => {
        //     if ((element.chat.status == chat_status.public || element.chat.status == chat_status.protected)
        //     && element.user == user && element.quit_status == quit_status.quit)
        //         chat.push({name: element.chat.name, status: element.chat.status});
        // })
        const chat = await this.chatRepository.find({
            select: ['name', "status"],
            where: [{status: chat_status.public},
            {status: chat_status.protected}]
        });
        // const ret: ChatEntity[] = [];
        // chat.forEach((element) => {
        //     this.getMember(element, id).then((membre) => {
        //         if (!membre || membre.quit_status == quit_status.quit)
        //             ret.push(element);
        //     })
        // });
        return chat;
    }

    async getMember(chat: ChatEntity, id: number)
    {
        const user = await this.userRepo.findOne({where: {ft_id: id}});
        if (!user)
            throw new NotFoundException();
        const member = await this.membersRepo.findOne({where: {user: user, chat: chat}});
        if (!member)
            throw new NotFoundException();
        return member;
    }

    async changeStatus(data: {channel: string, target: number, sender: number, status: number})
    {
        const chat = await this.chatRepository.findOne({where: {name: data.channel}});
        const target = await this.getMember(chat, data.target);
        const sender = await this.getMember(chat, data.sender);
        if (sender.status >= data.status && (data.status == status.ban && sender.status == status.default))
            throw new Error("you cant up this user");
        target.status = data.status;
        if (sender.status == status.owner && data.status == status.owner)
        {
            sender.status = status.default;
            this.membersRepo.save(sender);
        }
        if (status.ban)
            target.quit_status = quit_status.ban;
        this.membersRepo.save(target);
    }

    async changeStatusChan(data: {channel: string, id: number, status: number, password: string})
    {
        console.log(data);
        const chat = await this.getChat(data.channel);
        const member = await this.getMember(chat, data.id);
        if (member.status != status.owner)
            throw Error('not privilige');
        chat.status = data.status;
        console.log(chat);
        if (chat.status == chat_status.protected)
            chat.password = data.password;
        this.chatRepository.save(chat);
    }

    async joinChan(data: {channel: string, id: number, password: string})
    {
        const chat = await this.chatRepository.findOne({where: {name: data.channel}});
        if (!chat)
            throw new NotFoundException();
        if (chat.status == chat_status.protected && data.password != chat.password)
            throw new Error("not good password");
        if (chat.status == chat_status.private)
            throw new Error("cant join private chan");
    }

    async getLoginById(id: number)
    {
        const user = await this.userRepo.findOne({where: {ft_id: id}});
        return user.login;
    }

    async getIdByLogin(login: string)
    {
        const user = await this.userRepo.findOne({where: {login: login}});
        return user.ft_id;
    }

    async addMember(data: AddMemberDTO)
    {
        const chat = await this.chatRepository.findOne({where: {name: data.channel}});
        if (!chat)
            throw new NotFoundException();
        const user = await this.userRepo.findOne({where: {ft_id: data.id}});
        if (!user)
            throw new NotFoundException();
        const same = await this.membersRepo.findOne({where: {user: user, chat: chat}});
        let member: MemberEntity;
        if (same && same.quit_status > quit_status.none)
        {
            same.quit_status = quit_status.none;
            member = same;
        }
        else if (!same)
            member = this.membersRepo.create({user: user, status: data.status, mute: false, chat: chat});
        else
            throw new Error("cant join with same user");
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
