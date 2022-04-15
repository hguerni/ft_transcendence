import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	MessageBody,
	ConnectedSocket,
	OnGatewayConnection
  } from '@nestjs/websockets';

  import { Server, Socket } from 'socket.io'

  @WebSocketGateway()
  export class ChatGateway implements OnGatewayConnection{
	  @WebSocketServer() io: Server;

	  Clients = new Map<string, Socket>();

	  @SubscribeMessage('connection')
	  handleConnection(
		  @ConnectedSocket() client: Socket
	  )
	  {
		  this.Clients[client.handshake.auth.name] = client;
		  console.log(client.handshake.auth.name);
	  }

	  @SubscribeMessage('private-message')
	  handleEvent(
		  @MessageBody() {name, message}: {name: string, message: string}
	  ): void
	  {
		  this.Clients[name].emit('private-message', {name, message});
	  }
  }
