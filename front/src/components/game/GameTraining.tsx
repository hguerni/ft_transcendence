import GameArea, { GameStartTraining, GameReset } from './GameArea';
import { Socket, io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import UserService from '../../services/user.service';

const socket: Socket = io("ws://localhost:3030/game");

let intervalId: NodeJS.Timer;

export default function GameTraining() {
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [upOrDown, setUpOrDown] = useState<string>("");

  useEffect(() => {
    socket.on("GAME_END", (game: string) => {
      socket.emit("GAME_END", game, UserService.getUserId());
    });
  }, [])

  function movePaddleUp() {
    socket.emit("MOVE_PADDLE_UP");
  }

  function movePaddleDown() {
    socket.emit("MOVE_PADDLE_DOWN");
  }

  if (mouseDown) {
    if (upOrDown === "UP")
      intervalId = setInterval(movePaddleUp, 10);
    else
      intervalId = setInterval(movePaddleDown, 10);
  }
  else
    clearInterval(intervalId);

  return (
    <div>
      <div className="gameArea">
        <GameArea client={socket}/>
        {/*<button onMouseDown={() => {setMouseDown(true); setUpOrDown("UP")}} onMouseUp={() => setMouseDown(false)}>MOVE UP</button>
        <button onMouseDown={() => {setMouseDown(true); setUpOrDown("DOWN")}} onMouseUp={() => setMouseDown(false)}>MOVE DOWN</button>*/}
      </div>
      <div className="gameTrainingButtonsWrap">
        <button className="gameTrainingButton" style={{marginRight: '50px'}} onClick={() => GameStartTraining(socket)}><h5>START TRAINING</h5></button>
        <button className="gameTrainingButton" onClick={() => GameReset(socket)}><h5>RESET GAME</h5></button>
      </div>
    </div>
  );
}
