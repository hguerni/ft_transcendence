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

  import { Server, Socket } from 'socket.io'
  import { AddMemberDTO, ChatDTO, MsgDTO } from '../models/chat.model';
  import { ChatService, status } from '../services/chat.service';
  import { ChatEntity, chat_status } from '../entities/chat.entity';
import { randomUUID } from 'crypto';

  @WebSocketGateway({cors: {origin: "*"}, namespace: 'chat'})
  export class ChatGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect{
	@WebSocketServer() io: Server;

	constructor(private chatService: ChatService) {}

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
	handleReady(
		@ConnectedSocket() client: Socket,
		@MessageBody() userId: number
	)
	{
		let ret = {id: userId, socket: client};
		this.Connected.push(ret);
		this.chatService.getPvmsg(ret.id)
		.then((val) => {
			console.log(val);
			client.join(val);
		})
		client.join(userId.toString());
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
		catch (error) {console.log(error);}
	}

	async wait_mute(data: {channel: string, target: string, sender: string})
	{

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
		catch (e) {console.log(e);}
	}

	@SubscribeMessage('QUIT_CHAN')
	async quitChan(
		@MessageBody() data: {channel: string, id: number},
		@ConnectedSocket() client: Socket
	)
	{
		await this.chatService.Quit(data);
		this.io.in(data.id.toString()).socketsLeave(data.channel);
		this.getchannelname(client, data.id);
		const ret = await this.chatService.memberInChannel(data.channel);
		this.io.to(data.channel).emit('LIST_NAME', 
		{
			channel: data.channel,
			list: ret
		});
	}

	@SubscribeMessage('CHANGE_STATUS')
	async statusMember(
		@MessageBody() data: {channel: string, target: number, sender: number, status: number},
		@ConnectedSocket() client: Socket
	)
	{
		try {
			await this.chatService.changeStatus(data);
			const ret = await this.chatService.memberInChannel(data.channel);
			this.io.to(data.channel).emit('LIST_NAME', 
			{
				channel: data.channel,
				list: ret
			});
		}
		catch (e) { console.log(e) }
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
		catch (e) { console.log(e) }
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
		}
		catch (e) {
			console.log(e);
		}
	}

	@SubscribeMessage('addmember')
	async addmember(
		@MessageBody() data: {channel: string, login: string},
		@ConnectedSocket() client: Socket
	)
	{
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

	@SubscribeMessage('JUST_NAME_CHANNEL')
	getchannelinfo(
		@MessageBody() name: string,
		@ConnectedSocket() client: Socket
	)
	{
		this.chatService.memberInChannel(name)
		.then((val) => {
			client.emit('LIST_NAME', {
				channel: name,
				list: val
			})
		})
		this.chatService.messageInChannel(name)
		.then((val) => {
			client.emit('LIST_CHAT', {channel: name, list: val});
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
	}


	@SubscribeMessage('CREATE_CHANNEL')
	async handleCreateChannel(
		@ConnectedSocket() client: Socket, 
		@MessageBody() channelcreation: {channel: string, id: number,
										status: number, password: string})
	{
		try {
			await this.chatService.addOne({name: channelcreation.channel,
											status: channelcreation.status,
											password: channelcreation.password});
			await this.chatService.addMember({channel: channelcreation.channel,
											id: channelcreation.id,
											status: status.owner});
			const ret = await this.chatService.getPvmsg(channelcreation.id);
			this.io.to(channelcreation.id.toString()).emit('CHANNEL_CREATED', ret);
			this.io.to(channelcreation.id.toString()).socketsJoin(channelcreation.channel);
		}
		catch (e) {
			console.log(e);
		}

		// le serveur se connect sur le channel1 et retour le message
	}
	
	@SubscribeMessage('CREATE_MP_CHAN')
	async handleMpChan(
		@ConnectedSocket() client: Socket,
		@MessageBody() mp: {id: number, login: string}
	)
	{
		const name = 'mp' + randomUUID;
		this.handleCreateChannel(client, {channel: name, id: mp.id, status: chat_status.private, password: ''});
		this.addmember({channel: name, login: mp.login}, client);
		this .chatService.defineMp(name);
	}

	@SubscribeMessage('ALL_CHAN')
	async handleAllChan(
		@ConnectedSocket() client: Socket
	)
	{
		const channels = await this.chatService.getAccessibleChan();
		client.emit('ALL_CHAN', channels);
	}

    @SubscribeMessage('disconnect')
	handleDisconnect(
		@ConnectedSocket() client : Socket
	): void
	{
		this.Connected.forEach(element => {
			if (element.socket == client)
			{
				let index = this.Connected.indexOf(element);
				this.Connected.splice(index);
				return;
			}
		});
	}
  }
