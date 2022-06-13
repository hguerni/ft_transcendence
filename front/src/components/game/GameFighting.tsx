import { useEffect, useState } from "react";
import GameArea, { GameStart, GameCreate, GameAutoMaching } from './GameArea';
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
  const [customMode, setCustomMode] = useState<string>("");

  return (
    <div>
      <button className="gameButton" onClick={() => setOpen(true)}><h4>CREATE GAME</h4></button>
      <Popup open={open} closeOnDocumentClick onClose={() => setOpen(false)}>
        <h5>Enter a name for your game:</h5>

        <div style={{margin: '2.5em auto 0 auto', width: 'fit-content'}}>
          <input className="input"
            type="text"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
          />
        </div>

        <div className="checkBoxes">
          <input type="checkbox" id="customModeSpeed" name="customModeSpeed"
            onChange={(e) => {setCustomMode("customModeSpeed")}}/>
          <label><p>2x speed</p></label>

          <input type="checkbox" id="customModeColor" name="customModeColor"
            onChange={(e) => {setCustomMode("customModeColor")}}/>
          <label><p>color mode</p></label>

          <input type="checkbox" id="customModeOther" name="customModeOther"
            onChange={(e) => {setCustomMode("customModeOther")}}/>
          <label><p>other</p></label>
        </div>

        <br></br>

        <div style={{margin: 'auto', width: 'fit-content'}}>
          <button className="gameButton"
          onClick={() => {GameCreate(socket, gameName, customMode); setOpen(false); setCustomMode(""); setGameName(v4().substring(0, 10))}}><h4>SEND</h4></button>
        </div>
      </Popup>
    </div>
  );
}

export default function GameFighting() {

  useEffect(() => {
    linkClientToUser(socket, UserService.getUserId())
  }, []);

  return (
    <div className="gameFighting">

      <div className="searchGame">
        <GameSearching/>
      </div>

      <div className="gameInProgress">
        <GameInProgress/>
      </div>

      <div className='gameArea'>
          <GameArea client={socket}/>
      </div>

      <div className="gameTrainingButtonsWrap">
        <button className="gameTrainingButton" style={{marginRight: '50px'}} onClick={() => GameStart(socket)}><h5>START GAME</h5></button>
        <button className="gameTrainingButton" onClick={() => GameAutoMaching(socket)}><h5>AUTO MATCHING</h5></button>
      </div>
    </div>
  );
}
