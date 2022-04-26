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

  @WebSocketGateway({namespace: 'chat'})
  export class ChatGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect{
	@WebSocketServer() io: Server;

	Connected = [];

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
		this.Connected.push({
			username: client.username,
		})
	}

	@SubscribeMessage('private-message')
	handleEvent(
		@MessageBody() {name, message}: {name: string, message: string}
	): void
	{
		this.Clients[name].emit('private-message', {name, message});
	}

	@SubscribeMessage('disconnect')
	handleDisconnect(
		@MessageBody() {name, message}: {name: string, message: string}
	): void
	{
	}
  }
