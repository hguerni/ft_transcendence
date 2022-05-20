import "./Game.css"
import { BrowserRouter, Route, useHistory, useLocation } from "react-router-dom";
import GameTraining from './GameTraining';
import GameFighting from './GameFighting';
import { Redirect } from "react-router-dom";

export function TabNav() {
  const history = useHistory();

  const usePathname = () => {
    const location = useLocation();
    return location.pathname;
  }

  return (
    <div className='gameTabs'>
      <button onClick={() => history.push('/game/training')} className={usePathname() === '/game/training' ? 'tabButton tabButtonActive'  : 'tabButton' }>
        1 player
      </button>
      <button onClick={() => history.push('/game/fighting')} className={usePathname() === '/game/fighting' ? 'tabButton tabButtonActive'  : 'tabButton' }>
        2 players
      </button>
    </div>
  );
}

export default function GameTabs() {
  return (
    <div>
      <TabNav/>
      <BrowserRouter>
        <div>
          <Route exact path={"/game/training"} component={GameTraining} />
          <Route exact path={"/game/fighting"} component={GameFighting} />
        </div>
      </BrowserRouter>
    </div>

  );
}
