import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { logger } from 'src/websockets/game.gateway';
import { v4 } from 'uuid';

export class PongProps {
  gameIsStarted: boolean = false;
	width: number = 10000 / 2.2;
	height: number = 10000 / 3.2;
	score_l: number = 0;
	score_r: number = 0;
	ball_x: number = this.width / 2;
	ball_y: number = this.height / 2;
	ball_vx: number = 2;
	ball_vy: number = 2;
  speepFactor: number = 5;
	paddle_width: number = this.width / 60;
	paddle_height: number = this.height / 8.5;
	paddle_l_x: number = this.width / 30;
	paddle_l_y: number = this.height / 10;
	paddle_r_x: number = this.width - this.width / 30 - this.paddle_width;
	paddle_r_y: number = this.height / 10;
	customMode: string = "";
}

export class RoomProps {
  name: string = v4().substring(0, 10);
  trainingMode: boolean = false;
  canJoinGame: boolean = true;
  p1_name: string = "?";
  p2_name: string = "?";
  p1_userId: number = -1;
  p2_userId: number = -1;
  p1_readyToStart: boolean = false;
  p2_readyToStart: boolean = false;
  p1_score: number = 0;
  p2_score: number = 0;
}

function genRandomInt(min, max) {
 return Math.floor(Math.random() * (max - min + 1)) + min;
}

function genRandomVelocity() {
  let velocity = genRandomInt(1, 2);
  if (Math.random() * 2 < 1)
    velocity *= -1;
  return velocity
}

function collision() {
}

@Injectable()
export class GameService {
  private room: RoomProps = new RoomProps();

  private nb_players: number = 0;

  private pong: PongProps = new PongProps();

  private intervalId_0: NodeJS.Timer = null;
  private intervalId_1: NodeJS.Timer = null;

  private playersIds: Map<string, string> = new Map([["left", ""], ["right", ""]]);

  private launchBall(game: GameService)
  {
    game.pong.ball_x = game.pong.width / 2;
    game.pong.ball_y = genRandomInt(20, game.pong.height - 20);
    game.pong.ball_vx = genRandomVelocity();
    game.pong.ball_vy = genRandomVelocity();
  }

  private checkWin(game: GameService, wsServer: Server)
  {
    if (game.pong.ball_x < 0 || game.pong.ball_x > game.pong.width)
    {
      if (game.pong.ball_x < 0)
      {
        game.pong.score_r++;
        game.room.p2_score++;
      }
      else
      {
        game.pong.score_l++;
        game.room.p1_score++;
      }
      game.launchBall(game);
      wsServer.to(game.room.name).emit('GAME_UPDATE', JSON.stringify(game.pong));
      wsServer.to(game.room.name).emit("SEND_CURRENT_ROOM_INFOS", JSON.stringify(game.room))
      if (game.room.p1_score >= 2 || game.room.p2_score >= 2)
      {
        clearInterval(game.intervalId_0);
        if (game.room.p1_score > game.room.p2_score)
          wsServer.to(game.room.name).emit('SEND_GAME_STATUS', `${game.room.p1_name} has won the game!`);
        else
          wsServer.to(game.room.name).emit('SEND_GAME_STATUS', `${game.room.p2_name} has won the game!`);
        wsServer.to(game.room.name).emit('GAME_END', game.room.name);
      }
    }
  }

  private ballMoving(game: GameService, wsServer: Server)
  {
    let pong = game.pong;

    if (pong.ball_y > pong.height || pong.ball_y < 0)
      pong.ball_vy *= -1;
    if (pong.ball_x >= pong.paddle_l_x + pong.paddle_width && pong.ball_x < pong.paddle_l_x + pong.paddle_width * 1.5
      && pong.ball_y > pong.paddle_l_y && pong.ball_y < pong.paddle_l_y + pong.paddle_height)
    {
      pong.ball_vx *= -1.2;
      pong.ball_vy = genRandomVelocity();
    }
    if (pong.ball_x <= pong.paddle_r_x && pong.ball_x > pong.paddle_r_x - pong.paddle_width * 0.5
      && pong.ball_y > pong.paddle_r_y && pong.ball_y < pong.paddle_r_y + pong.paddle_height)
    {
      pong.ball_vx *= -1.2;
      pong.ball_vy = genRandomVelocity();
    }
    pong.ball_x += pong.ball_vx * pong.speepFactor;
    pong.ball_y += pong.ball_vy * pong.speepFactor;
    //pong.paddle_l_y = pong.ball_y - 25;
    if (game.room.trainingMode && pong.ball_y - pong.paddle_height / 2 < pong.height - pong.paddle_height + 5
      && pong.ball_y - pong.paddle_height / 2 > 5)
    pong.paddle_r_y = pong.ball_y - pong.paddle_height / 2;
    wsServer.to(game.room.name).emit('GAME_UPDATE', JSON.stringify(pong));
  }

  startGame(wsServer: Server, room: string)
  {
    this.room.name = room;

    this.launchBall(this);
    wsServer.to(this.room.name).emit('SEND_GAME_STATUS', "Let's play!");
    this.pong.gameIsStarted = true;
    this.pong.ball_y = this.pong.height / 2;
    wsServer.to(this.room.name).emit('GAME_UPDATE', JSON.stringify(this.pong));
    if (this.intervalId_0 == null)
      this.intervalId_0 = setInterval(this.ballMoving, 10, this, wsServer);
    this.intervalId_1 = setInterval(this.checkWin, 20, this, wsServer);
  }

  resetGame(wsServer: Server)
  {
    if (this.intervalId_0 != null) {
      clearInterval(this.intervalId_0);
      this.intervalId_0 = null;
    }
    if (this.intervalId_1 != null) {
      clearInterval(this.intervalId_1);
      this.intervalId_1 = null;
    }
    this.pong = new PongProps();
    wsServer.to(this.room.name).emit('GAME_UPDATE', JSON.stringify(this.pong))
  }

  movePaddleUp(wsServer: Server, clientId: string)
  {
    if (this.playersIds.get("left") === clientId)
    {
      if (this.pong.paddle_l_y > 5)
        this.pong.paddle_l_y -= 8 * this.pong.speepFactor;
    }
    else if (this.playersIds.get("right") === clientId)
    {
      if (this.pong.paddle_r_y > 5)
        this.pong.paddle_r_y -= 8 * this.pong.speepFactor;
    }
  }

  movePaddleDown(wsServer: Server, clientId: string)
  {
    if (this.playersIds.get("left") === clientId)
    {
      if (this.pong.paddle_l_y < this.pong.height - (this.pong.paddle_height + 5))
        this.pong.paddle_l_y += 8 * this.pong.speepFactor;
    }
    else if (this.playersIds.get("right") === clientId)
    {
      if (this.pong.paddle_r_y < this.pong.height - (this.pong.paddle_height + 5))
        this.pong.paddle_r_y += 8 * this.pong.speepFactor;
    }
  }

  setRoomName(name: string) {
    this.room.name = name;
  }

  setPlayersSocketIds(clientId: string)
  {
    if (this.playersIds.get("left") == "")
    {
      this.playersIds.set("left", clientId);
      this.nb_players++;
    }
    else if (this.playersIds.get("right") == "")
    {
      this.playersIds.set("right", clientId);
      this.nb_players++;
      this.room.canJoinGame = false;
    }
  }

  setPlayersNamesAndIds(p_name: string, p_userId: number) {
    if (this.room.p1_name === "?") {
      this.room.p1_name = p_name;
      this.room.p1_userId = p_userId;
    }
    else {
      this.room.p2_name = p_name;
      this.room.p2_userId = p_userId;
    }
  }

  setPlayerReady(clientId: string) {
    if (this.playersIds.get("left") === clientId)
      this.room.p1_readyToStart = true;
    else
      this.room.p2_readyToStart = true;
  }

  setTrainingModeOn(clientId: string) {
    this.room.trainingMode = true;
    this.playersIds.set("left", clientId);
    this.playersIds.set("right", "Bob");
    this.room.p2_name = "Bob";
    this.room.p2_readyToStart = true;
  }

  setCustomMode(wsServer: Server, customMode: string) {
    this.pong.customMode = customMode;
    if (customMode === "speedx2")
      this.pong.speepFactor *= 2;
    else if (customMode === "customModeColor")
      true;
    else if (customMode === "other")
      true;
    wsServer.to(this.room.name).emit('GAME_UPDATE', JSON.stringify(this.pong));
  }

  setPongProps(newPongProps: PongProps) {
    this.pong = newPongProps;
  }

  gameUpdate (wsServer: Server) {
    wsServer.to(this.room.name).emit('GAME_UPDATE', JSON.stringify(this.pong));
    console.log(` test: ${this.room.name}`);
  }

  getPongProps(): PongProps {
    return this.pong;
  }

  getRoomProps(): RoomProps {
    return this.room;
  }

  getPlayerSocketId(id: string): string {
    return this.playersIds.get(id);
  }
}
