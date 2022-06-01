import React from "react";
import { BrowserRouter, Redirect, Route, useLocation } from "react-router-dom";
import Login from "./components/login.component";
// import LoginSuccess from "./components/loginsuccess.component";
import Profile from './components/profile/profile';
import Navbar from './components/navbar.component';
import Game from './components/game/Game';
import Chat from "./components/chat/chat";
import Profiles from './components/profile/profilepublic';
import './App.css';
import TwoFa from "./components/2fa/login2fa.component";
import ActivateTwoFa from "./components/2fa/activate2fa.component";
import { GetUserData } from "./services/user.service";
import UserService from "./services/user.service";
import Header from "./components/header/Header";
import GameInvite from "./components/game/GameInvite";

function Routes() {
  if (UserService.isUserConnected() || true)
    return (
      <BrowserRouter>
        <main>
        {/*<Navbar/>*/}
          <Header/>
          <Route exact path={"/"} component={Login} />
          <Route exact path={"/profile"} component={Profile} />
          <Route exact path={"/profiles"} component={Profiles} />
          <Route exact path={"/2fa"} component={TwoFa} />
          <Route exact path={"/activate2fa"} component={ActivateTwoFa} />
          <Route exact path={"/game"} component={Game} />
          <Route exact path={"/game/training"} component={Game} />
          <Route exact path={"/game/fighting"} component={Game} />
          <Route path={"/game/join/:game"} component={GameInvite} />
          <Route exact path={"/chat"} component={Chat} />
        </main>
      </BrowserRouter>
    );
  return (
    <BrowserRouter>
      <main>
        {/*<Navbar/>*/}
        <Route exact path={"/"} component={Login} />
        <Redirect to="/"/>
      </main>
    </BrowserRouter>
  );
}

function App() {
  GetUserData();
  console.log("heyheyhey");
  return (
    <Routes/>
  );
}

export default App;
