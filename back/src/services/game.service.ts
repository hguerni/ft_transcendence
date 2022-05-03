import { Injectable } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { logger } from 'src/websockets/game.gateway';
import { v4 } from 'uuid'

export class PongProps {
  width: number = 600;
  height: number = 400;
  score_l: number = 0;
  score_r: number = 0;
  ball_x: number = 600 / 2;
  ball_y: number = 400 / 2;
  ball_vx: number = 2;
  ball_vy: number = 2;
  paddle_l_x: number = 15;
  paddle_l_y: number = 50;
  paddle_r_x: number = 575;
  paddle_r_y: number = 50;
}

export class RoomProps {
  name: string = `room_${v4()}`;
  trainingMode: boolean = false;
  canJoinGame: boolean = true;
  player1: string = "";
  palyer2?: string;
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
        game.pong.score_r++;
      else
        game.pong.score_l++;
      game.launchBall(game);
      wsServer.to(game.room.name).emit('GAME_UPDATE', JSON.stringify(game.pong));
    }
  }

  private ballMoving(game: GameService, wsServer: Server)
  {
    let pong = game.pong;

    if (pong.ball_y > pong.height || pong.ball_y < 0)
      pong.ball_vy *= -1;
    if (pong.ball_x >= pong.paddle_l_x + 10 && pong.ball_x < pong.paddle_l_x + 15
      && pong.ball_y > pong.paddle_l_y && pong.ball_y < pong.paddle_l_y + 50)
    {
      pong.ball_vx *= -1.1;
      pong.ball_vy = genRandomVelocity();
    }
    if (pong.ball_x <= pong.paddle_r_x && pong.ball_x > pong.paddle_r_x - 5
      && pong.ball_y > pong.paddle_r_y && pong.ball_y < pong.paddle_r_y + 50)
    {
      pong.ball_vx *= -1.1;
      pong.ball_vy = genRandomVelocity();
    }
    pong.ball_x += pong.ball_vx;
    pong.ball_y += pong.ball_vy;
    //pong.paddle_l_y = pong.ball_y - 25;
    if (game.room.trainingMode)
      pong.paddle_r_y = pong.ball_y - 25;
    wsServer.to(game.room.name).emit('GAME_UPDATE', JSON.stringify(pong));
  }

  startGame(wsServer: Server, room: string)
  {
    this.room.name = room;

    this.launchBall(this);
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
        this.pong.paddle_l_y -= 4;
    }
    else if (this.playersIds.get("right") === clientId)
    {
      if (this.pong.paddle_r_y > 5)
        this.pong.paddle_r_y -= 4;
    }
  }

  movePaddleDown(wsServer: Server, clientId: string)
  {
    if (this.playersIds.get("left") === clientId)
    {
      if (this.pong.paddle_l_y < this.pong.height - 55)
        this.pong.paddle_l_y += 4;
    }
    else if (this.playersIds.get("right") === clientId)
    {
      if (this.pong.paddle_r_y < this.pong.height - 55)
        this.pong.paddle_r_y += 4;
    }
  }

  setRoomName(name: string) {
    this.room.name = name;
  }

  setPlayersIds(clientId: string)
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

  setTrainingModeOn(clientId: string) {
    this.room.trainingMode = true;
    this.playersIds.set("left", clientId);
    this.playersIds.set("right", "Bob");
  }

  getPongProps(): PongProps {
    return this.pong;
  }

  getNbPlayers(): number {
    return this.nb_players;
  }

  getRoomProps(): RoomProps {
    return this.room;
  }
}