import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./components/login.component";
// import LoginSuccess from "./components/loginsuccess.component";
import Profile from './components/profile/profile';
import Navbar from './components/navbar.component';
import Game from './components/game/Game';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <main>
        <Navbar/>
        <Route exact path={"/"} component={Login} />
        <Route exact path={"/profile"} component={Profile} />
        <Route exact path={"/game"} component={Game} />
        <Route exact path={"/game/training"} component={Game} />
        <Route exact path={"/game/fighting"} component={Game} />
      </main>
    </BrowserRouter>
  );
}

export default App;
