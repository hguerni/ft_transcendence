import './Game.css';
import { Socket, io } from 'socket.io-client';
import { useEffect } from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import GameTraining from './GameTraining';
import GameFighting from './GameFighting';
import GameRules from './GameRules';
import UserService from '../../services/user.service';

export const socket: Socket = io("ws://localhost:3030/game");

function Game() {
  useEffect(() => {
    socket.removeListener("ALERT");
    socket.on("ALERT", (message: string) => {
      alert(message);
    });
    socket.on("GAME_END", (gameName: string) => {
      socket.emit("GAME_END", gameName, UserService.getUserId());
    });
  }, []);

  return (
      <div className='gameWrap'>
          <div className="gameTitle">
            <h4>PONG</h4>
          </div>
          <GameRules/>
          <BrowserRouter>
              <Route exact path={"/game/training"} component={GameTraining} />
              <Route exact path={"/game/fighting"} component={GameFighting} />
          </BrowserRouter>
        </div>
  );
}

export default Game;
