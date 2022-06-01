import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WsResponse, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Subscriber } from 'rxjs';
import { GameService, PongProps, RoomProps } from '../services/game.service';
import { v4 } from 'uuid'

export let logger: Logger = new Logger('gameTest');

@WebSocketGateway({cors: {origin: "*"}, namespace: 'game'})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wsServer: Server;
  private logger: Logger = new Logger('GameGateway');
  private gameRooms: Map<string, GameService>;
  private clientsToRoom: Map<string, string> = new Map();
  private getRoomsGroup: string = v4(); // room name of clients who wants infos on games (or rooms) in progress
  private watchersIds: string[] = [""];
  private usersToClients: Map<number, Array<string>> = new Map();
  //private usersToClients: Map<number, string> = new Map();

  constructor() {
    this.gameRooms = new Map();
  }

  afterInit(server: Server) {
    this.logger.log("Initialized!");
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const room = this.clientsToRoom.get(client.id);
    if (room != undefined)
    {
      //this.clientsToRoom.delete(client.id);
      client.leave(room);
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  private handleSendingRooms(clients: string) {
    let rooms: RoomProps[] = [];
    for (const [key, value] of this.gameRooms.entries()) {
      if (!value.getRoomProps().trainingMode)
        rooms.push(value.getRoomProps());
    }
    this.wsServer.to(clients).emit("SEND_ROOMS_INFOS", JSON.stringify(rooms))
    this.logger.log("SEND_ROOMS_INFOS");
  }

  private handleSendingCurrentRoom(clientId: string) {
    let room: GameService = this.gameRooms.get(this.clientsToRoom.get(clientId));
    if (room) {
      this.wsServer.to(clientId).emit("SEND_CURRENT_ROOM_INFOS", JSON.stringify(room.getRoomProps()))
      this.logger.log("SEND_CURRENT_ROOM_INFOS");
    }
  }

  @SubscribeMessage('GAME_END')
  handleEndGamer(client: Socket, game: string) {
    this.logger.log(`Client ${client.id} want to end game ${game}`);
    if (this.gameRooms.has(game)) {
      this.gameRooms.delete(game);
      this.clientsToRoom.delete(client.id);
      this.logger.log(`Client ${client.id} is ending game ${game}`);
    }
  }

  @SubscribeMessage('LINK_CLIENT_TO_USER')
  handleLinkClientToUser(client: Socket, userID: number) {
    if (!this.usersToClients.has(userID)) {
      this.usersToClients.set(userID, [client.id]);
      this.logger.log(`Client ${client.id} is link to user ${userID}`);
      return ;
    }

    if (this.usersToClients.get(userID).includes(client.id)) {
      let clients = this.usersToClients.get(userID);
      clients.push(client.id);
      this.usersToClients.set(userID, clients);
    }
    if (this.clientsToRoom.has(this.usersToClients.get(userID).at(-1))) {
      this.clientsToRoom.set(client.id, this.clientsToRoom.get(this.usersToClients.get(userID).at(-1)));
    }
    this.handleSendingCurrentRoom(client.id);
    this.logger.log(`Client ${client.id} is link to user ${userID}`);
  }

  @SubscribeMessage('MOVE_PADDLE_UP')
  handlePaddleMovingUp(client: Socket) {
    const room = this.clientsToRoom.get(client.id);

    this.gameRooms.get(room).movePaddleUp(this.wsServer, client.id);
  }

  @SubscribeMessage('MOVE_PADDLE_DOWN')
  handlePaddleMovingDown(client: Socket) {
    const room = this.clientsToRoom.get(client.id);

    this.gameRooms.get(room).movePaddleDown(this.wsServer, client.id);
  }

  @SubscribeMessage('GAME_START')
  handleGameStarting(client: Socket) {
    const room = this.clientsToRoom.get(client.id);
    let p1_name = this.gameRooms.get(room).getRoomProps().p1_name;
    let p2_name = this.gameRooms.get(room).getRoomProps().p2_name;
    let p1_id = this.gameRooms.get(room).getPlayerId('left');
    let p2_id = this.gameRooms.get(room).getPlayerId('right');

    this.gameRooms.get(room).setPlayerReady(client.id);
    if (this.gameRooms.get(room).getRoomProps().p1_readyToStart === true &&
      this.gameRooms.get(room).getRoomProps().p2_readyToStart === true)
      this.gameRooms.get(room).startGame(this.wsServer, room);
    this.logger.log("GAME_STARTED");
    if (this.gameRooms.get(room).getRoomProps().p1_readyToStart && this.gameRooms.get(room).getRoomProps().p2_readyToStart)
      this.wsServer.to(this.clientsToRoom.get(client.id)).emit("PLAYER_IS_READY", "");
    else if (this.gameRooms.get(room).getPlayerId('left') === client.id)
    {
      this.wsServer.to(p2_id).emit("SEND_GAME_STATUS", `${p1_name} is ready to start!`);
      this.wsServer.to(p1_id).emit("SEND_GAME_STATUS", `Waiting for ${p2_name} to start...`);
    }
    else
    {
      this.wsServer.to(p1_id).emit("SEND_GAME_STATUS", `${p2_name} is ready to start!`);
      this.wsServer.to(p2_id).emit("SEND_GAME_STATUS", `Waiting for ${p1_name} to start...`);
    }
  }

  @SubscribeMessage('START_TRAINING')
  handleStartingTraining(client: Socket) {
    if (!(this.clientsToRoom.has(client.id))) {
      const gameRoom = new GameService();
      const gameRoomName = gameRoom.getRoomProps().name;
      gameRoom.setPlayersIds(client.id);
      gameRoom.setTrainingModeOn(client.id);
      this.gameRooms.set(gameRoom.getRoomProps().name, gameRoom);
      client.join(gameRoomName);
      this.clientsToRoom.set(client.id, gameRoomName);
      this.logger.log(`Client ${client.id} has joined the room ${gameRoomName}`);
    }
    const room = this.clientsToRoom.get(client.id);
    this.gameRooms.get(room).startGame(this.wsServer, room);
    this.logger.log("TRAINING_STARTED");
  }

  @SubscribeMessage('GAME_RESET')
  handleGameReset(client: Socket) {
    const room = this.clientsToRoom.get(client.id);

    this.gameRooms.get(room).resetGame(this.wsServer);
    this.logger.log("GAME_RESETED");
  }

  @SubscribeMessage('GAME_CREATE')
  handleCreatingRoom(client: Socket, args: string[]) {
    let p_name = args[0];
    let roomName = args[1];
    let customMode = args[2];

    if (this.clientsToRoom.has(client.id) && !this.watchersIds.includes(client.id)) {
      this.wsServer.to(client.id).emit("ALERT", "You have already joined a game!");
      return ;
    }
    this.watchersIds.splice(this.watchersIds.indexOf(client.id), 1);
    const gameRoom = new GameService();
    gameRoom.setRoomName(roomName);
    this.clientsToRoom.set(client.id, roomName);
    gameRoom.setPlayersIds(client.id);
    gameRoom.setPlayersNames(p_name);
    this.gameRooms.set(roomName, gameRoom);
    client.join(roomName);
    this.handleSendingRooms(this.getRoomsGroup);
    this.handleSendingCurrentRoom(client.id);
    this.logger.log(`GAME ${roomName} CREATED by ${client.id}`);
  }

  @SubscribeMessage('GAME_JOIN')
  handleJoiningRoom(client: Socket, args: string[]) {
    let p_name = args[0];
    let roomName = args[1];

    if (this.clientsToRoom.has(client.id) && !this.watchersIds.includes(client.id)) {
      this.wsServer.to(client.id).emit("ALERT", "You have already joined a game!");
      return ;
    }
    this.watchersIds.splice(this.watchersIds.indexOf(client.id), 1)
    this.clientsToRoom.set(client.id, roomName);
    this.gameRooms.get(roomName).setPlayersIds(client.id);
    this.gameRooms.get(roomName).setPlayersNames(p_name);
    client.join(roomName);
    this.handleSendingRooms(this.getRoomsGroup);
    this.handleSendingCurrentRoom(client.id);
    this.logger.log("GAME_JOINED");
  }

  @SubscribeMessage('GET_ROOMS')
  handleGettingRooms(client: Socket) {
    client.join(this.getRoomsGroup);
    this.handleSendingRooms(client.id);
  }

  @SubscribeMessage('GET_CURRENT_ROOM')
  handleGettingCurrentRoom(client: Socket) {
    this.handleSendingCurrentRoom(client.id);
  }

  @SubscribeMessage('GAME_WATCH')
  handleWatchingGame(client: Socket, roomToWatch: string) {
    if (this.clientsToRoom.has(client.id) && !this.watchersIds.includes(client.id)) {
      this.wsServer.to(client.id).emit("ALERT", "You have already joined a game!");
      return ;
    }
    this.watchersIds.push(client.id);
    client.join(roomToWatch);
    this.clientsToRoom.set(client.id, roomToWatch);
    this.handleSendingCurrentRoom(client.id);
    this.wsServer.to(client.id).emit("GAME_UPDATE", JSON.stringify(this.gameRooms.get(roomToWatch).getPongProps()));
    this.logger.log(`Client ${client.id} has joined the room ${roomToWatch}`);
    this.logger.log("GAME_WATCHED");
  }

  @SubscribeMessage('GAME_LEAVE')
  handleLeavingRoom(client: Socket) {
    const room = this.clientsToRoom.get(client.id);
    this.clientsToRoom.delete(client.id);
    client.leave(room);
    this.logger.log(`Client ${client.id} has leaved the room ${room}`);
  }

  @SubscribeMessage('GAME_SET_PONG_PROPS')
  handleResizingRoom(client: Socket, newPongProps: string) {
    const roomName = this.clientsToRoom.get(client.id);

    this.gameRooms.get(roomName).setPongProps(JSON.parse(newPongProps));
    this.logger.log('GAME_SET_PONG_PROPS');
  }
}
