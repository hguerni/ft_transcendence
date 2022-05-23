import { useHistory, useLocation } from "react-router-dom";


export default function GameRules () {
  const history = useHistory();

  const usePathname = () => {
    const location = useLocation();
    return location.pathname;
  }

  if (usePathname() != "/game")
    return (<></>);

  return (
    <div>
      <button onClick={() => history.push('/game/training')} className="gameTrainingButton">1 player</button>
      <button onClick={() => history.push('/game/fighting')} className="gameTrainingButton">2 players</button>
    </div>
  );
}
