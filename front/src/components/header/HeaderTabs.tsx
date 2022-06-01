import "./Header"
import { useHistory, useLocation } from "react-router-dom";

export default function HeaderTabs () {
  const history = useHistory();
  const pathName = useLocation().pathname;

  return (
    <div className='headerTabs'>
      <button onClick={() => history.push('/chat')} className={pathName === '/chat' ||
        pathName.startsWith('/chat/') ? 'headerTabButton headerTabButtonActive'  : 'headerTabButton' }>
        <span style={{fontSize: '26px'}}>Chat</span>
      </button>
      <button onClick={() => history.push('/game')} className={pathName === '/game' ||
        pathName.startsWith("/game/") ? 'headerTabButton headerTabButtonActive'  : 'headerTabButton' }>
        <span style={{fontSize: '26px'}}>Game</span>
      </button>
      <button onClick={() => history.push('/profile')} className={pathName === '/profile' ||
        pathName.startsWith("/profile/") ? 'headerTabButton headerTabButtonActive'  : 'headerTabButton' }>
        <span style={{fontSize: '26px'}}>Profile</span>
      </button>
    </div>
  );
}
