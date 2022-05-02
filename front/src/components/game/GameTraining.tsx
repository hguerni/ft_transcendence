import React from "react";
import Gamezone, { GameStartTraining, GameStart, GameReset, GameJoin, GameWatch, GetRooms } from './Gamezone';
import { io, Socket } from "socket.io-client";

const socket: Socket = io("ws://localhost:3030");

export default function GameTraining() {
  return (
    <div>
      <div className="GameZone">
        <Gamezone client={socket}/>
      </div>
      <div className="Gamezone">
        <button className="gameButton" onClick={() => GameStartTraining(socket)}>START TRAINING</button>
        <button className="gameButton" onClick={() => GameReset(socket)}>RESET GAME</button>
      </div>
      <div className="GameZone">
      </div>
    </div>
  );
}
