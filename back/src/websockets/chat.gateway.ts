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
		.then(() => {
			this.chatService.messageInChannel(msg.channel)
			.then((val) => {
				client.emit('LIST_CHAT', val);
			})
		})
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
		.then(()=>{
			this.chatService.messageInChannel(data.channel)
			.then((val) => {
				client.emit('LIST_CHAT', val);
		})
		})
		.catch((error) => {
			//client.emit('addmember', error)
		});
	}

	@SubscribeMessage('JUST_NAME_CHANNEL')
	getchannelinfo(
		@MessageBody() name: string,
		@ConnectedSocket() client: Socket
	)
	{
		
		//if (name == "coucou")
		//	client.emit('LIST_NAME', ['elias','hava', 'leo']);
		//else
		//	client.emit('LIST_NAME', ['rayane','pierre']);
		
		//if (name == "coucou")
		//	client.emit('LIST_CHAT', [
		//		{name: 'hava', message: 'message3'}, 
		//		{name: 'elias', message: 'message4'},
		//		{name: 'leo', message: 'message5'}])
		//else
		//	client.emit('LIST_CHAT', [
		//		{name: 'pierre', message: 'message1'}, 
		//		{name: 'rayane', message: 'message2'}])
		this.chatService.memberInChannel(name)
		.then((val) => {
			client.emit('LIST_NAME', val)
		})
		this.chatService.messageInChannel(name)
		.then((val) => {
			client.emit('LIST_CHAT', val);
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
		@MessageBody() channelcreation: {channel: string, login: string})
	{
		try {
			await this.chatService.addOne({
				name: channelcreation.channel,
				status: 0,
				password: ""
			})
			await this.chatService.addMember(channelcreation)
			const ret = await this.chatService.getPvmsg(channelcreation.login)
			//client.join(channelcreation.channel);
			client.emit('CHANNEL_CREATED', ret);
		}
		catch (e) {
			client.emit('error', "une erreur est survenue");
		}

		// le serveur se connect sur le channel1 et retour le message
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

  }
