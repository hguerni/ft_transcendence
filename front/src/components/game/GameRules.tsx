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
      <h4 style={{fontSize: '4em', textAlign: 'center', marginBottom: '1em'}}>Welcome to PONG!</h4>
      <br></br>
      <p style={{fontSize: '2em', textAlign: 'center', marginBottom: '1.5em'}}>
        Pong is a table tennis–themed twitch arcade sports video game, featuring simple two-dimensional graphics,
        manufactured by Atari and originally released in 1972. It was one of the earliest arcade video games.
      </p>
      <p style={{fontSize: '2em', textAlign: 'center', marginBottom: '1.5em'}}>
        The player controls an in-game paddle by moving it vertically across the left or right side of the screen.
        They can compete against another player controlling a second paddle on the opposing side. Players use the paddles
        to hit a ball back and forth. The goal is for each player to reach eleven points before the opponent;
        points are earned when one fails to return the ball to the other.
      </p>
      <p style={{fontSize: '2em', textAlign: 'center', marginBottom: '1.5em'}}>
        <h6>Controls:</h6>
        <br></br>
        Press <span style={{color: '#e74c3c'}}>Z</span> to move paddle <span style={{color: '#e74c3c'}}>UP</span> /
        Press <span style={{color: '#e74c3c'}}>S</span> to move paddle <span style={{color: '#e74c3c'}}>DOWN</span>
      </p>
      <br></br>
      <div style={{margin: 'auto', width: 'fit-content'}}>
        <button onClick={() => history.push('/game/training')} style={{marginRight: '5em'}} className="gameTrainingButton"><h4>1 player</h4></button>
        <button onClick={() => history.push('/game/fighting')} className="gameTrainingButton"><h4>2 players</h4></button>
      </div>

    </div>
  );
}
