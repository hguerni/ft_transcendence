import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./components/login.component";
// import LoginSuccess from "./components/loginsuccess.component";
import Profile from './components/profile/profile';
import Navbar from './components/navbar.component';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <main>
        <Navbar/>
        <Route exact path={"/"} component={Login} />
        <Route exact path={"/profile"} component={Profile} />
      </main>
    </BrowserRouter>
  );
}

export default App;

