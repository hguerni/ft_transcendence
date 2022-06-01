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
      <button onClick={() => history.push('/game/training')} className="gameTrainingButton"><h4>1 player</h4></button>
      <button onClick={() => history.push('/game/fighting')} className="gameTrainingButton"><h4>2 players</h4></button>
    </div>
  );
}
