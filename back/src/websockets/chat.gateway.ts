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
  import { chat_status } from 'src/entities/chat.entity';

  @WebSocketGateway({cors: {origin: "*"}, namespace: 'chat'})
  export class ChatGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect{
	@WebSocketServer() io: Server;

	constructor(private chatService: ChatService) {}

	Connected : {name: string | string[], socket: Socket}[] = [];

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
		@MessageBody() login: string
	)
	{
		let ret = {name: login, socket: client};
		this.Connected.push(ret);
		this.chatService.getPvmsg(ret.name)
		.then((val) => {
			console.log(val);
			client.join(val);
		})
		client.join(login);
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

	@SubscribeMessage('MUTE')
	async mute(
		@MessageBody() data: {channel: string, target: string, sender: string},
		@ConnectedSocket() client: Socket
	)
	{
		try {
			await this.chatService.Mute(data);
			const ret = await this.chatService.memberInChannel(data.channel);
			this.io.to(data.channel).emit('LIST_NAME', 
			{
				channel: data.channel,
				list: ret
			});
		}
		catch (e) {console.log(e);}
	}

	@SubscribeMessage('QUIT_CHAN')
	async quitChan(
		@MessageBody() data: {channel: string, login: string},
		@ConnectedSocket() client: Socket
	)
	{
		await this.chatService.Quit(data);
		this.io.in(data.login).socketsLeave(data.channel);
		this.getchannelname(client, data.login);
		const ret = await this.chatService.memberInChannel(data.channel);
		this.io.to(data.channel).emit('LIST_NAME', 
		{
			channel: data.channel,
			list: ret
		});
	}

	@SubscribeMessage('CHANGE_STATUS')
	async statusChan(
		@MessageBody() data: {channel: string, target: string, sender: string, status: number},
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

	@SubscribeMessage('JOIN_CHAN')
	async joinChan(
		@MessageBody() data: {channel: string, login: string, password: string},
		@ConnectedSocket() client: Socket
	)
	{
		try {
			await this.chatService.joinChan(data);
			await this.addmember({...data, status: status.default}, client);
		}
		catch (e) {
			console.log(e);
		}
	}

	@SubscribeMessage('addmember')
	async addmember(
		@MessageBody() data: AddMemberDTO,
		@ConnectedSocket() client: Socket
	)
	{
		await this.chatService.addMember({...data, status: status.default});
		const ret = await this.chatService.memberInChannel(data.channel);
		this.Connected.forEach(element => {
			if (element.name == data.login)
			{
				element.socket.join(data.channel);
				this.getchannelname(element.socket, element.name);
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
		@MessageBody() name: string
	)
	{
		this.chatService.getPvmsg(name)
		.then((val) => {
			client.emit('CHANNEL_CREATED', val);
		})
	}
		
	@SubscribeMessage('CREATE_CHANNEL')
	async handleCreateChannel(
		@ConnectedSocket() client: Socket, 
		@MessageBody() channelcreation: {channel: string, login: string,
										status: number, password: string})
	{
		try {
			await this.chatService.addOne({name: channelcreation.channel,
											status: channelcreation.status,
											password: channelcreation.password});
			await this.chatService.addMember({channel: channelcreation.channel,
											login: channelcreation.login,
											status: status.owner});
			const ret = await this.chatService.getPvmsg(channelcreation.login);
			this.io.to(channelcreation.login).emit('CHANNEL_CREATED', ret);
			this.io.to(channelcreation.login).socketsJoin(channelcreation.channel);
		}
		catch (e) {
			console.log(e);
		}

		// le serveur se connect sur le channel1 et retour le message
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
