import "./Header"
import { BrowserRouter, Route, useHistory, useLocation } from "react-router-dom";
import Chat from "../chat/chat";
import Game from "../game/Game";

export default function HeaderTabs () {
  const history = useHistory();

  const usePathname = () => {
    const location = useLocation();
    return location.pathname;
  }

  return (
    <div className='headerTabs'>
      <button onClick={() => history.push('/chat')} className={usePathname() === '/chat' ? 'headerTabButton headerTabButtonActive'  : 'headerTabButton' }>
        <span style={{fontSize: '26px'}}>Chat</span>
      </button>
      <button onClick={() => history.push('/game')} className={usePathname() === '/game' ? 'headerTabButton headerTabButtonActive'  : 'headerTabButton' }>
        <span style={{fontSize: '26px'}}>Game</span>
      </button>
    </div>
  );
}