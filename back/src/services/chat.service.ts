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
import {hash, compare} from 'bcrypt';

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
        const chat = await this.chatRepository.findOne({where: {name: name}});
        if (!chat)
            throw new Error("chat not find");
        return chat;
    }

    async getPvmsg(id: number)
    {
        const user = await this.getUser(id);
        const channels = await this.membersRepo.find({select: ['id', 'quit_status'], where: {user: user}, relations: ['chat']});

        const tmp: string[] = [];
        channels.forEach((element) => {
            if (element.quit_status == quit_status.none && element.chat.mp_message == false)
                tmp.push(element.chat.name);
        })
        return tmp;
    }

    async mpexist(data: {target: number, sender: number})
    {
        const user1 = await this.getUser(data.target);
        if (!user1)
            throw new Error("user not exist");
        const user2 = await this.getUser(data.sender);
        const chat = await this.chatRepository.find({where: {mp_message: true}, relations:['members', 'members.user']});
        let test: ChatEntity;
        chat.forEach(element => {
            if ((element.members[0].user.ft_id == user1.ft_id && element.members[1].user.ft_id == user2.ft_id)
            || (element.members[0].user.ft_id == user2.ft_id && element.members[1].user.ft_id == user1.ft_id))
            {
                test = element;
                return ;
            }
        });
        return test;
    }

    getMpuser(user: UserEntity, users: MemberEntity[])
    {
        if (users[0].user.login != user.login)
            return (users[0].user.username);
        return (users[1].user.username);
    }

    async getMpmsg(id: number)
    {
        const user = await this.getUser(id);
        const channels = await this.membersRepo.find({select: ['id', 'quit_status'], where: {user: user}, relations: ['chat', 'user', 'chat.members', 'chat.members.user']});

        const tmp: {name: string, username: string}[] = [];
        channels.forEach((element) => {
            if (element.quit_status == quit_status.none && element.chat.mp_message == true)
                tmp.push({name: element.chat.name, username: this.getMpuser(user, element.chat.members)});
        })
        return tmp;
    }

    async getUser(id: number)
    {
        const user = await this.userRepo.findOne({where: {ft_id: id}});
        if (!user)
            throw new Error("user not find");
        return user;
    }

    async addOne(data: ChatDTO){
        const chat = this.chatRepository.create({...data, messages: [], members: [], mp_message: false});
        return await this.chatRepository.save(chat);
    }

    async defineMp(channel: string)
    {
        const chat = await this.getChat(channel);
        chat.mp_message = true;
        this.chatRepository.save(chat);
    }

    async Mute(data: {channel: string, target: number, sender: number})
    {
        const chat = await this.getChat(data.channel);
        const tomute = await this.getMember(chat, data.target);
        const send = await this.getMember(chat, data.sender);
        if (send.status > status.admin || tomute.status < send.status)
            throw Error("No privilege");
        tomute.mute = true;
        this.membersRepo.save(tomute);
    }

    async unMute(data: {channel: string, target: number, sender: number})
    {
        const chat = await this.getChat(data.channel);
        const tomute = await this.getMember(chat, data.target);
        const send = await this.getMember(chat, data.sender);
        tomute.mute = false;
        this.membersRepo.save(tomute);
    }

    async removeChat(chat: ChatEntity)
    {
        const msg = await this.msgRepo.find({where: {chat: chat}});
        await this.msgRepo.remove(msg);
        const members = await this.membersRepo.find({where: {chat: chat}});
        await this.membersRepo.remove(members);
        await this.chatRepository.remove(chat);
    }

    async Quit(data: {channel: string, id: number})
    {
        const chat = await this.getChat(data.channel);
        if (chat.mp_message == true)
            throw new Error("you can't quit private message");
        const membre = await this.getMember(chat, data.id);
        membre.quit_status = quit_status.quit;
        await this.membersRepo.save(membre);
        if (membre.status == status.owner)
        {
            const member = await this.membersRepo.findOne({where: {chat: chat, status: Not(status.owner), quit_status: 0}, relations: ['user']});
            if (!member)
                return this.removeChat(chat);
            member.status = status.owner;
            this.changeStatus({channel: data.channel, target: member.user.ft_id, sender: data.id, status: 0});
        }
        return this.membersRepo.save(membre);
    }

    async addMsg(data: MsgDTO){
        const chat = await this.chatRepository.findOne({where:{name: data.channel}, relations: ["messages"]});
        if (!chat)
            throw new Error("chat not find");
        const user = await this.getUser(data.id);
        const member = await this.membersRepo.findOne({where: {user: user, chat: chat}, relations: ['chat', 'chat.messages']});
        if (member.mute || member.quit_status > quit_status.none)
            throw Error("is mute, quit or ban");
        const message = this.msgRepo.create({"member": member, "message": data.message, "chat": chat});
        chat.messages.push(message);
        await this.chatRepository.save(chat).catch((e) => {throw new Error("can't add message")});
        const resu2 = await this.msgRepo.save(message).catch((e) => {throw new Error("can't add message")});
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
        if (!chat)
        {
            throw new Error('no channel find');
        }
        const tmp: {id: number, name: string, message: string}[] = [];
        chat.messages.forEach((element) => {
            tmp.push({id: element.member.user.ft_id, name: element.member.user.username, message: element.message});
        })
        return tmp;
    }

    async getAccessibleChan(id: number)
    {
        const user = await this.getUser(id);
        const chat = await this.chatRepository.find({
            select: ['name', "status"],
            where: [{status: chat_status.public},
            {status: chat_status.protected}]
        });
        return chat;
    }

    async getMember(chat: ChatEntity, id: number)
    {
        const user = await this.getUser(id);
        const member = await this.membersRepo.findOne({where: {user: user, chat: chat}});
        if (!member)
            throw new Error("user is not in channel");
        return member;
    }

    async unban(data: {channel: string, target: number, sender: number, status: number})
    {
        data.status = status.default;
        await new Promise(() => setTimeout(() => {
            this.changeStatus(data)
        }, 5000));
    }

    async changeStatus(data: {channel: string, target: number, sender: number, status: number})
    {
        const chat = await this.getChat(data.channel);
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
        if (data.status == status.ban)
            target.quit_status = quit_status.ban;
        this.membersRepo.save(target);
        if (data.status == status.ban)
        {
            await new Promise(() => setTimeout(() => {
                target.status = status.default;
                this.membersRepo.save(target);
            }, 20000));
        }
    }

    async changeStatusChan(data: {channel: string, id: number, status: number, password: string})
    {
        const chat = await this.getChat(data.channel);
        const member = await this.getMember(chat, data.id);
        if (member.status != status.owner)
            throw Error('not privilige');
        chat.status = data.status;
        if (chat.status == chat_status.protected)
            chat.password = await hash(data.password, 10);
        this.chatRepository.save(chat);
    }

    async joinChan(data: {channel: string, id: number, password: string})
    {
        const chat = await this.getChat(data.channel);
        if (!chat)
            throw new NotFoundException();
        if (chat.status == chat_status.protected)
        {
            const check = await compare(data.password, chat.password);
            if (!check)
                throw new Error("wrong password");
        }
        if (chat.status == chat_status.private)
            throw new Error("cant join private chan");
    }

    async getLoginById(id: number)
    {
        const user = await this.getUser(id);
        return user.login;
    }

    async getIdByLogin(login: string)
    {
        const user = await this.userRepo.findOne({where: {login: login}});
        if (!user)
            throw new Error("user doesn't exist");
        return user.ft_id;
    }

    async getIdByftid(ft_id: number)
    {
        const user = await this.userRepo.findOne({select: ['id'], where: {ft_id: ft_id}});
        if (!user)
            throw new Error("user doesn't exist");
        return user.id;
    }

    async addMember(data: AddMemberDTO)
    {
        const chat = await this.getChat(data.channel);
        if (chat.mp_message)
            throw new Error("you can't add member to a private message");
        const user = await this.getUser(data.id);
        const same = await this.membersRepo.findOne({where: {user: user, chat: chat}});
        let member: MemberEntity;
        if (same && same.quit_status > quit_status.none)
        {
            if (same.status == status.ban)
                throw new Error("you are ban from this chan");
            same.quit_status = quit_status.none;
            same.status = status.default;
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
