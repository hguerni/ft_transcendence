import './Game.css';
import GameTabs from './GameTabs';
import { Socket, io } from 'socket.io-client';
import UserService from '../../services/user.service';

export const socket: Socket = io("ws://localhost:3030/game");

export const userService: UserService = new UserService();

function Game() {
  //const userID = UserService.getActiveUserID();
  //console.log(userID);
  return (
    <>
      <div>
        <h1 id="test"></h1>
      </div>
      <GameTabs/>
    </>
  );
}

export default Game;
