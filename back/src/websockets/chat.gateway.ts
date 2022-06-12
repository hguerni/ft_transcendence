import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	MessageBody,
	ConnectedSocket,
	OnGatewayConnection,
	OnGatewayInit,
	OnGatewayDisconnect
  } from '@nestjs/websockets';
import { subscribeOn } from 'rxjs';
  import {hash, compare} from 'bcrypt';
  import { Server, Socket } from 'socket.io'
  import { AddMemberDTO, ChatDTO, MsgDTO } from '../models/chat.model';
  import { ChatService, status } from '../services/chat.service';
  import { ChatEntity, chat_status } from '../entities/chat.entity';
  import { UserService } from '../services/user.service';
import { createHash, generateKey, getHashes, Hash, pseudoRandomBytes, randomBytes, randomFill, randomInt, randomUUID } from 'crypto';
import { getRepository } from 'typeorm';

  @WebSocketGateway({cors: {origin: "*"}, namespace: 'chat'})
  export class ChatGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect{
	@WebSocketServer() io: Server;

	constructor(private chatService: ChatService, private userService: UserService) {}

	Connected : {id: number, socket: Socket}[] = [];

	afterInit() {
	this.io.use((socket, next) => {
		next();
	});
	}

	@SubscribeMessage('connection')
	handleConnection(
		@ConnectedSocket() client: Socket
	)
	{
		
	}

	@SubscribeMessage('ready')
	async handleReady(
		@ConnectedSocket() client: Socket,
		@MessageBody() userId: number
	)
	{
		let ret = {id: userId, socket: client};
		this.Connected.push(ret);
		this.chatService.getPvmsg(ret.id)
		.then((val) => {
			client.join(val);
		})
		client.join(userId.toString());
		client.emit('BLOCKED', await this.userService.getBlocking(userId));
	}

	@SubscribeMessage('addmsg')
	async addmsg(
		@MessageBody() msg: MsgDTO,
		@ConnectedSocket() client: Socket
	)
	{
		try {
			await this.chatService.addMsg(msg);
			const val = await this.chatService.messageInChannel(msg.channel);
			this.io.to(msg.channel).emit('LIST_CHAT', {channel: msg.channel, list: val});
		}
		catch (e) {
			const error: Error = e;
			client.emit('ERROR', error.message);
		}
	}

	@SubscribeMessage('MUTE')
	async mute(
		@MessageBody() data: {channel: string, target: number, sender: number},
		@ConnectedSocket() client: Socket
	)
	{
		try {
			await this.chatService.Mute(data);
			await new Promise(() => setTimeout(() => {this.chatService.unMute(data)}, 5000));
		}
		catch (e) {
			const error: Error = e;
			client.emit('ERROR', error.message);
		}
	}

	@SubscribeMessage('INVITE')
	async invitetoplay(
		@MessageBody() data: {target: number, message: string, sender: number},
		@ConnectedSocket() client: Socket
	)
	{
		try {
			await this.handleMpChan(client, {target: data.target, sender: data.sender});
			const chat = await this.chatService.mpexist({target: data.target, sender: data.sender});
			await this.addmsg({
				message: data.message,
				channel: chat.name,
				id: data.sender
			}, client);
		}
		catch (e) {
			const error: Error = e;
			client.emit('ERROR', error.message);
		}
	}

	@SubscribeMessage('BLOCK')
	async block(
		@MessageBody() data: {target: number, sender: number},
		@ConnectedSocket() client: Socket
	)
	{
		try {
			data.target = await this.chatService.getIdByftid(data.target);
			await this.userService.block(data.sender, data.target);
		}
		catch (e) {
			const error: Error = e;
			client.emit('ERROR', error.message);
		}
	}

	@SubscribeMessage('UNBLOCK')
	async unblock(
		@MessageBody() data: {target: number, sender: number},
		@ConnectedSocket() client: Socket
	)
	{
		try {
			data.target = await this.chatService.getIdByftid(data.target);
			await this.userService.removeFriend(data.sender, data.target);
		}
		catch (e) {
			const error: Error = e;
			client.emit('ERROR', error.message);
		}
	}

	@SubscribeMessage('QUIT_CHAN')
	async quitChan(
		@MessageBody() data: {channel: string, id: number},
		@ConnectedSocket() client: Socket
	)
	{
		try {
			await this.chatService.Quit(data);
			await this.chatService.getPvmsg(data.id)
			.then((val) => {
				this.io.in(data.id.toString()).emit('CHANNEL_CREATED', val);
			});
			this.io.in(data.id.toString()).socketsLeave(data.channel);
			const ret = await this.chatService.memberInChannel(data.channel);
			this.io.to(data.channel).emit('LIST_NAME', 
			{
				channel: data.channel,
				list: ret
			});
		}
		catch (e) {
			const error: Error = e;
			client.emit('ERROR', error.message);
		}
	}

	@SubscribeMessage('CHANGE_STATUS')
	async statusMember(
		@MessageBody() data: {channel: string, target: number, sender: number, status: number},
		@ConnectedSocket() client: Socket
	)
	{
		try {
			await this.chatService.changeStatus(data);
			if (data.status === status.ban)
				this.quitChan({channel: data.channel, id: data.target}, client);
			else
			{
				const ret = await this.chatService.memberInChannel(data.channel);
				this.io.to(data.channel).emit('LIST_NAME', 
				{
					channel: data.channel,
					list: ret
				});
			}
		}
		catch (e) {
			const error: Error = e;
			client.emit('ERROR', error.message);
		}
	}

	@SubscribeMessage('CHANGE_STATUS_CHAN')
	async statusChan(
		@MessageBody() data: {channel: string, id: number, status: number, password: string},
		@ConnectedSocket() client: Socket
	)
	{
		try {
			await this.chatService.changeStatusChan(data);
		}
		catch (e) {
			const error: Error = e;
			client.emit('ERROR', error.message);
		}
	}

	@SubscribeMessage('JOIN_CHAN')
	async joinChan(
		@MessageBody() data: {channel: string, id: number, password: string},
		@ConnectedSocket() client: Socket
	)
	{
		try {
			await this.chatService.joinChan(data);
			const login = await this.chatService.getLoginById(data.id);
			const member = {channel: data.channel, login: login};
			await this.addmember(member, client);
			this.getchannelname(client, data.id);
		}
		catch (e) {
			const error: Error = e;
			client.emit('ERROR', error.message);
		}
	}

	@SubscribeMessage('addmember')
	async addmember(
		@MessageBody() data: {channel: string, login: string},
		@ConnectedSocket() client: Socket
	)
	{
		try {
			const id = await this.chatService.getIdByLogin(data.login);
			await this.chatService.addMember({channel: data.channel, id: id, status: status.default});
			const ret = await this.chatService.memberInChannel(data.channel);
			this.Connected.forEach(element => {
				if (element.id == id)
				{
					element.socket.join(data.channel);
					this.getchannelname(element.socket, element.id);
					return;
				}
			});
			this.io.to(data.channel).emit('LIST_NAME', 
			{
				channel: data.channel,
				list: ret
			});
		}
		catch (e) {
			const error: Error = e;
			client.emit('ERROR', error.message);
		}
	}

	@SubscribeMessage('JUST_NAME_CHANNEL')
	getchannelinfo(
		@MessageBody() data: {name: string, id: number},
		@ConnectedSocket() client: Socket
	)
	{
		this.chatService.memberInChannel(data.name)
		.then((val) => {
			val.forEach((element) => {
				if (element.id == data.id)
					client.emit('STATUS', element.status);
			})
			client.emit('LIST_NAME', {
				channel: data.name,
				list: val
			})
		})
		this.chatService.messageInChannel(data.name)
		.then((val) => {
			client.emit('LIST_CHAT', {channel: data.name, list: val});
		})
	}

	@SubscribeMessage('GET_CHANNEL')
	getchannelname(
		@ConnectedSocket() client: Socket,
		@MessageBody() id: number
	)
	{
		this.chatService.getPvmsg(id)
		.then((val) => {
			client.emit('CHANNEL_CREATED', val);
		})
		this.chatService.getMpmsg(id)
		.then((val) => {
			client.emit('MP_CREATED', val);
		})
	}


	@SubscribeMessage('CREATE_CHANNEL')
	async handleCreateChannel(
		@ConnectedSocket() client: Socket, 
		@MessageBody() channelcreation: {channel: string, id: number,
										status: number, password: string})
	{
		try {
			if (channelcreation.channel[0] === " " || channelcreation.channel === "")
				throw new Error('cant create null channel');
			await this.chatService.addOne({name: channelcreation.channel,
											status: channelcreation.status,
											password: await hash(channelcreation.password, 10)});
			await this.chatService.addMember({channel: channelcreation.channel,
											id: channelcreation.id,
											status: status.owner});
			const ret = await this.chatService.getPvmsg(channelcreation.id);
			this.io.to(channelcreation.id.toString()).emit('CHANNEL_CREATED', ret);
			this.io.to(channelcreation.id.toString()).socketsJoin(channelcreation.channel);
		}
		catch (e) {
			const error: Error = e;
			client.emit('ERROR', error.name);
		}

		// le serveur se connect sur le channel1 et retour le message
	}
	
	@SubscribeMessage('CREATE_MP_CHAN')
	async handleMpChan(
		@ConnectedSocket() client: Socket,
		@MessageBody() mp: {target: number, sender: number}
	)
	{
		try{
			if (await this.chatService.mpexist(mp))
				throw new Error("deja créé");
			const name = randomBytes(4).toString('hex');
			await this.chatService.addOne({name: name,
				status: chat_status.private,
				password: ""});
			this.chatService.defineMp(name);
			await this.chatService.addMember({channel: name, id: mp.sender, status: status.default});
			await this.chatService.addMember({channel: name, id: mp.target, status: status.default});
			
			const ret = await this.chatService.getMpmsg(mp.sender);
			this.io.to(mp.sender.toString()).emit('MP_CREATED', ret);
			this.io.to(mp.sender.toString()).socketsJoin(name);
			
			const ret2 = await this.chatService.memberInChannel(name);
			this.io.to(mp.target.toString()).socketsJoin(name);
			this.Connected.forEach(element => {
				if (element.id == mp.target)
				{
					this.getchannelname(element.socket, element.id);
					return;
				}
			});
			this.io.to(name).emit('LIST_NAME', 
			{
				channel: name,
				list: ret2
			});
		}
		catch (e) {
			const error: Error = e;
			client.emit('ERROR', error.message);
		}
	}

	@SubscribeMessage('ALL_CHAN')
	async handleAllChan(
		@MessageBody() id: number,
		@ConnectedSocket() client: Socket
	)
	{
		try{
			const channels = await this.chatService.getAccessibleChan(id);
			client.emit('ALL_CHAN', channels);
		}
		catch (e) {
			const error: Error = e;
			client.emit('ERROR', error.message);
		}
	}

    @SubscribeMessage('disconnect')
	handleDisconnect(
		@ConnectedSocket() client : Socket
	): void
	{
		this.Connected.forEach(element => {
			if (element.socket === client)
			{
				let index = this.Connected.indexOf(element);
				this.Connected.splice(index);
				return;
			}
		});
	}
  }
