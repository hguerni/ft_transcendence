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
		//console.log(client.handshake);
		//console.log(client.conn.request);
		let ret = {name: client.handshake.headers.name, socket: client};
		this.Connected.push(ret);

	}

	@SubscribeMessage('ready')
	handleReady(
		@ConnectedSocket() client: Socket,
		@MessageBody() login: string
	)
	{
		this.chatService.getPvmsg(login).then((ret) => {
			const toemit = {
				getmsg: ret
			}
			client.emit("ready", toemit);
		}).catch((error) => {client.emit("ready", error)});
	}


	@SubscribeMessage('private-message')
	handleEvent(
		@MessageBody() {name, message}: {name: string, message: string},
		@ConnectedSocket() client : Socket
	): void
	{
		//this.chatService.getChat("pv-")
		this.Connected.forEach(element => {
		if (element.name == name)
		{
			element.socket.emit('private-message', {name, message});
			return;
		}
		});
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

	@SubscribeMessage('addmember')
	addmember(
		@MessageBody() data: AddMemberDTO,
		@ConnectedSocket() client: Socket
	): void
	{
		this.chatService.addMember(data)
		.then((val) => client.emit('addmember', val.user.login))
		.catch((error) => client.emit('addmember', error));
	}

	// @SubscribeMessage('test')
	// test(
	// 	@ConnectedSocket() client: Socket
	// ): void
	// {
	// 	this.chatService.getPvmsg("psemsari").then( (v) => console.log(v));
	// }

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

	  /* fonction pour le chat rayane et elias */

	  @SubscribeMessage('bonjour du client')
	  handleSendingInputChat(client: Socket,  message: string) {
	
		client.join("channel1"); // sert a connecter le client sur le channel1
		this.io.to("channel1").emit("bonjour du serveur",  message) // le serveur se connect sur le channel1 et retour le message
		
	  }
	
	
		@SubscribeMessage('joinroom')
		handleJoinRoomChat(client: Socket) {
	  
		  client.join("channel1");
		
		}
	
		@SubscribeMessage('CREATE_CHANNEL')
		handleCreateChannel(client: Socket, channelName: string) {
	  
		  client.join("channel2");
			const resu = this.chatService.addOne({
				name: channelName,
				password: "",
				status: 0
			});
			resu.then((test) => {
				this.io.to("channel2").emit("CHANNEL_CREATED",  test.name) // le serveur se connect sur le channel1 et retour le message
			})
		}
  }
