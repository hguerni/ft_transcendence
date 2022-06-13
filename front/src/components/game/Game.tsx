import './Game.css';
import { Socket, io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { Route, BrowserRouter, Redirect } from 'react-router-dom';
import GameTraining from './GameTraining';
import GameFighting from './GameFighting';
import GameRules from './GameRules';
import UserService from '../../services/user.service';
import axios from 'axios';

export const socket: Socket = io("ws://54.245.74.93:3030/game").removeAllListeners();

function Game() {

  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
      let mounted = true;

      const authorization = async () => {
          try { await axios.get('userData'); }
          catch(err){if(mounted) setUnauthorized(true);}
      }
      authorization();
      return () => {mounted = false;}
  }, []);

  useEffect(() => {
    socket.removeListener("ALERT");
    socket.on("ALERT", (message: string) => {
      alert(message);
    });
    socket.on("GAME_END", (gameName: string) => {
      socket.emit("GAME_END", gameName, UserService.getUserId());
    });

    return () => {
      socket.off('ALERT');
      socket.off('GAME_END');
    }
  }, []);

  if (unauthorized)
    return <Redirect to={'/'}/>;

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
