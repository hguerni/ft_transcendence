import React from 'react';
import "./Game.css"
import { BrowserRouter, Route, useHistory, useLocation } from "react-router-dom";

import GameTraining from './GameTraining';
import GameFighting from './GameFighting';

export function TabNav() {
  const history = useHistory();

  const usePathname = () => {
    const location = useLocation();
    console.log(location.pathname);
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
          <Route exact path={"/game"} component={GameTraining} />
          <Route exact path={"/game/training"} component={GameTraining} />
          <Route exact path={"/game/fighting"} component={GameFighting} />
        </div>
      </BrowserRouter>
    </div>

  );
}

/*
export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <BrowserRouter>
      <main>
        <Route exact path={"/game"} component={Gamezone} />
      </main>
    </BrowserRouter>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Box>
        <Tabs sx={tabsStyle} value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab sx={tabStyle1} label="Training" {...a11yProps(0)} />
          <Tab sx={tabStyle2} label="Fighting" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <div className='GameZone'>
            <Gamezone/>
        </div>
        <div className='Gamezone'>
            <button onClick={GameStartTraining}>START TRAINING</button>
            <button onClick={GetRooms}>GET ROOMS</button>
            <button onClick={GameWatch}>WATCH GAME</button>
            <button onClick={GameJoin}>JOIN GAME</button>
            <button onClick={GameStart}>START GAME</button>
            <button onClick={GameReset}>RESET GAME</button>
          </div>
          <div className="GameZone">
            <p>Intruction for testing: JOIN GAME {'->'} START GAME</p>
          </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className='GameZone'>
            to be implemented
        </div>
      </TabPanel>
    </Box>
  );
}
*/
