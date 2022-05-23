import GameArea, { GameStartTraining, GameReset } from './GameArea';
import { Socket, io } from 'socket.io-client';

const socket: Socket = io("ws://localhost:3030/game");


export default function GameTraining() {
  socket.on("GAME_END", (game: string) => {
    socket.emit("GAME_END", game);
  });

  return (
    <div>
      <div className="gameArea">
        <GameArea client={socket}/>
      </div>
      <div className="gameTrainingButtonsWrap">
        <button className="gameTrainingButton" style={{marginRight: '50px'}} onClick={() => GameStartTraining(socket)}>START TRAINING</button>
        <button className="gameTrainingButton" onClick={() => GameReset(socket)}>RESET GAME</button>
      </div>
    </div>
  );
}
