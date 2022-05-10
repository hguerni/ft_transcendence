import { useState } from "react";
import GameArea, { GameStart, GameCreate } from './GameArea';
import { io, Socket } from "socket.io-client";
import Popup from 'reactjs-popup';
import { v4 } from 'uuid'
import { GameSearching } from "./GameSearching";
import { GameInProgress } from "./GameInProgress";

export const socket: Socket = io("ws://localhost:3030");

function CreateGamePopUp() {
  const [gameName, setGameName] = useState<string>(v4().substring(0, 10));
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button className="gameButton" onClick={() => setOpen(true)}> CREATE GAME</button>
      <Popup open={open} closeOnDocumentClick onClose={() => setOpen(false)}>
        <div>Enter a name for your game:</div>
        <input className="input"
          type="text"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
        />
        <button className="gameButton" onClick={() => {GameCreate(socket, gameName); setOpen(false); setGameName(v4().substring(0, 10))}}>SEND</button>
      </Popup>
    </div>
  );
}

export default function GameFighting() {
let getName;

  return (
    <div className="gameFighting">
      <div>
        <div className="searchGame">
          <GameSearching/>
        </div>
        <div className="gameInProgress">
          <GameInProgress/>
        </div>
      </div>
      <div className='gameArea'>
        <GameArea client={socket}/>
      </div>
      <div className="gameArea">
        <CreateGamePopUp/>
        <button className="gameButton" onClick={() => GameStart(socket)}>START GAME</button>
      </div>
    </div>
  );
}

//<button className="gameButton" onClick={() => GameCreate(socket)}>CREATE GAME</button>
