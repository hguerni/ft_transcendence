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

  import { Server, Socket } from 'socket.io'
  import { ChatDTO, MsgDTO } from '../models/chat.model';
  import { ChatService } from '../services/chat.service';

  @WebSocketGateway({namespace: 'chat'})
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
		let ret = {name: client.handshake.headers.name, socket: client};
		this.Connected.push(ret);
	}

	@SubscribeMessage('private-message')
	handleEvent(
		@MessageBody() {name, message}: {name: string, message: string},
		@ConnectedSocket() client : Socket
	): void
	{
		this.Connected.forEach(element => {
			if (element.name == name)
			{
				element.socket.emit('private-message', {name, message});
				return;
			}
		});
	}

	@SubscribeMessage('addchat')
	addchat(
		@MessageBody() chat: ChatDTO,
		@ConnectedSocket() client: Socket
	): void
	{
		this.chatService.addOne(chat)
		.then((val) => client.emit('addchat', val))
		.catch((error) => client.emit('addchat', error));
	}

	@SubscribeMessage('addmsg')
	addmsg(
		@MessageBody() msg: MsgDTO,
		@ConnectedSocket() client: Socket
	): void
	{
		this.chatService.addMsg(msg)
		.then((val) => client.emit('addmsg', val))
		.catch((error) => client.emit('addmsg', error));
	}

	@SubscribeMessage('getmsg')
	getmsg(
		@MessageBody() id: number,
		@ConnectedSocket() client: Socket
	): void
	{
		this.chatService.getMsg(id)
		.then((val) => client.emit('addmsg', val))
		.catch((error) => client.emit('addmsg', error));
	}

	@SubscribeMessage('disconnect')
	handleDisconnect(
		@ConnectedSocket() client : Socket
	): void
	{
		this.Connected.forEach(element => {
			if (element.socket = client)
			{
				let index = this.Connected.indexOf(element);
				this.Connected.splice(index);
				return;
			}
		});
	}
  }
