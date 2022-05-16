import './Game.css';
import GameTabs from './GameTabs';
import { Socket, io } from 'socket.io-client';
import { useEffect } from 'react';
import { GetUserData } from '../../services/user.service';
import UserService from '../../services/user.service';

export const socket: Socket = io("ws://localhost:3030/game");

function linkClientToUser(client: Socket, userID: number) {
	client.emit("LINK_CLIENT_TO_USER", userID);
}

function Game() {
  GetUserData();
  linkClientToUser(socket, UserService.getUserId())
  useEffect(() => {
    socket.on("ALERT", (message: string) => {
      alert(message);
      console.log("test alert!")
    });
  }, []);

  return (
    <>
      <div>
        <h1></h1>
      </div>
      <GameTabs/>
    </>
  );
}

export default Game;
