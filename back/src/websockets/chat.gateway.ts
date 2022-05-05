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
<<<<<<< Updated upstream:back/src/websockets/chat.gateway.ts
  import { ChatDTO, MsgDTO } from '../models/chat.model';
=======
<<<<<<< Updated upstream:back/src/websockets/chat.getaway.ts
  import { ChatDTO } from '../models/chat.model';
=======
  import { AddMemberDTO, ChatDTO, MsgDTO } from '../models/chat.model';
>>>>>>> Stashed changes:back/src/websockets/chat.gateway.ts
>>>>>>> Stashed changes:back/src/websockets/chat.getaway.ts
  import { ChatService } from '../services/chat.service';

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

<<<<<<< Updated upstream:back/src/websockets/chat.gateway.ts
    @SubscribeMessage('disconnect')
=======
<<<<<<< Updated upstream:back/src/websockets/chat.getaway.ts
	@SubscribeMessage('disconnect')
=======
	@SubscribeMessage('addmember')
	addmember(
		@MessageBody() data: AddMemberDTO,
		@ConnectedSocket() client: Socket
	): void
	{
		this.chatService.addMember(data)
		.then((val) => client.emit('addchat', val))
		.catch((error) => client.emit('addchat', error));
	}

    @SubscribeMessage('disconnect')
>>>>>>> Stashed changes:back/src/websockets/chat.gateway.ts
>>>>>>> Stashed changes:back/src/websockets/chat.getaway.ts
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
