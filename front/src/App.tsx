import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./components/login.component";
import LoginSuccess from "./components/loginsuccess.component";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <main>
        <Route path={"/"} component={Login} />
        <Route path={"/profile"} component={LoginSuccess} />
      </main>
    </BrowserRouter>
  );
}

export default App;

