import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WsResponse, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Subscriber } from 'rxjs';
import { GameService, RoomProps } from '../services/game.service';
import { v4 } from 'uuid'

export let logger: Logger = new Logger('gameTest');

@WebSocketGateway({cors: {origin: "*"}})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wsServer: Server;
  private logger: Logger = new Logger('GameGateway');
  private gameRooms: Map<string, GameService>;
  private clientsToRoom: Map<string, string> = new Map();
  private getRoomsGroup: string = v4(); // room name of clients who wants infos on games (or rooms) in progress

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
    logger.log(room);
    this.gameRooms.get(room).setPlayerReady(client.id);
    if (this.gameRooms.get(room).getRoomProps().p1_readyToStart === true &&
      this.gameRooms.get(room).getRoomProps().p2_readyToStart === true)
      this.gameRooms.get(room).startGame(this.wsServer, room);
    this.logger.log("GAME_STARTED");
  }

  @SubscribeMessage('START_TRAINING')
  handleStartingTraining(client: Socket) {
    if (!(client.id in this.clientsToRoom)) {
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
  handleCreatingRoom(client: Socket, room: string) {
    if (client.id in this.clientsToRoom) {
      this.wsServer.to(client.id).emit("USER_GAME_ALREADY_CREATED")
      return ;
    }
    const gameRoom = new GameService();
    gameRoom.setRoomName(room);
    this.clientsToRoom.set(client.id, room);
    gameRoom.setPlayersIds(client.id);
    this.gameRooms.set(room, gameRoom);
    client.join(room);
    this.handleSendingRooms(this.getRoomsGroup);
    this.logger.log(`GAME ${room} CREATED`);
  }

  @SubscribeMessage('GAME_JOIN')
  handleJoiningRoom(client: Socket, room: string) {
    for (const [key, value] of this.clientsToRoom)
      this.logger.log("test: " + key + ' ' + value);
    if (client.id in this.clientsToRoom) {
      this.wsServer.to(client.id).emit("USER_GAME_ALREADY_JOINED")
      return ;
    }
    this.clientsToRoom.set(client.id, room);
    this.gameRooms.get(room).setPlayersIds(client.id);
    client.join(room);
    this.handleSendingRooms(this.getRoomsGroup);
    this.logger.log("GAME_JOINED");
  }

  @SubscribeMessage('GET_ROOMS')
  handleGettingRooms(client: Socket) {
    client.join(this.getRoomsGroup);
    this.handleSendingRooms(client.id);
    logger.log(this.clientsToRoom.get(client.id));
  }

  @SubscribeMessage('GAME_WATCH')
  handleWatchingGame(client: Socket, roomToWatch: string) {
    client.join(roomToWatch);
    this.clientsToRoom.set(client.id, roomToWatch);
    this.logger.log(`Client ${client.id} has joined the room ${roomToWatch}`);
    this.logger.log("GAME_WATCHED");
  }

  @SubscribeMessage('GAME_LEAVE')
  handleLeavingRoom(client: Socket) {
    const room = this.clientsToRoom[client.id];
    this.clientsToRoom.delete(client.id);
    client.leave(room);
    this.logger.log(`Client ${client.id} has leaved the room ${room}`);
  }
}
