import GameArea, { GameStartTraining, GameReset } from './GameArea';
import { socket } from './Game';

export default function GameTraining() {
  return (
    <div>
      <div className="gameArea">
        <GameArea client={socket}/>
      </div>
      <div className="gameArea">
        <button className="gameButton" onClick={() => GameStartTraining(socket)}>START TRAINING</button>
        <button className="gameButton" onClick={() => GameReset(socket)}>RESET GAME</button>
      </div>
      <div className="gameArea">
      </div>
    </div>
  );
}
