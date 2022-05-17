import { useEffect, useState } from "react";
import GameArea, { GameStart, GameCreate } from './GameArea';
import Popup from 'reactjs-popup';
import { v4 } from 'uuid'
import { GameSearching } from "./GameSearching";
import { GameInProgress } from "./GameInProgress";
import { socket } from "./Game";
import UserService from '../../services/user.service';
import { Socket } from "socket.io-client";

function linkClientToUser(client: Socket, userID: number) {
	client.emit("LINK_CLIENT_TO_USER", userID);
}

export function CreateGamePopUp() {
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
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    linkClientToUser(socket, UserService.getUserId())
    socket.on("PLAYER_IS_READY", (msg: string) => {
      setMsg(msg);
    });
  }, [])

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
        <button className="gameButton" onClick={() => GameStart(socket)}>START GAME</button>
      </div>
      <div className="gameArea">{msg}</div>
    </div>
  );
}

//<button className="gameButton" onClick={() => GameCreate(socket)}>CREATE GAME</button>
