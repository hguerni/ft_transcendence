import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import Profile from './components/profile/profile';
import axios from "axios";

axios.defaults.baseURL = 'http://localhost:3030/';
axios.defaults.withCredentials = true;


ReactDOM.render(
  //<React.StrictMode> //desactivate for testing websockets
    <App />,
  //</React.StrictMode>,
  document.getElementById("root")
);
