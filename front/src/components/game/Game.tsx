import './Game.css';
import GameTabs from './GameTabs';
import { Socket, io } from 'socket.io-client';
import { useEffect } from 'react';
import { GetUserData } from '../../services/user.service';

export const socket: Socket = io("ws://localhost:3030/game");

function Game() {
  useEffect(() => {
    socket.on("ALERT", (message: string) => {
      alert(message);
    });
  }, []);
  socket.on('GAME_END', (game: string) => {
    console.log("endddddddddddddddd")
    socket.emit("GAME_END", game);
  });
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
