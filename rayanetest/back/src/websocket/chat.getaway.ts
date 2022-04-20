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

	Clients = new Map<string, Socket>();

	afterInit() {
	this.io.use((socket, next) => {
		const sessionID = socket.handshake.auth.sessionID;
		if (sessionID) {
		  const session = sessionStore.findSession(sessionID);
		  if (session) {
			socket.sessionID = sessionID;
			socket.userID = session.userID;
			socket.username = session.username;
			return next();
		  }
		}
		const username = socket.handshake.auth.username;
		if (!username) {
		  return next(new Error("invalid username"));
		}
		socket.sessionID = randomId();
		socket.userID = randomId();
		socket.username = username;
		next();
	});
	}

	@SubscribeMessage('connection')
	handleConnection(
		@ConnectedSocket() client: Socket
	)
	{
		// persist session
		sessionStore.saveSession(client.sessionID, {
			userID: client.userID,
			username: client.username,
			connected: true,
		});
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
