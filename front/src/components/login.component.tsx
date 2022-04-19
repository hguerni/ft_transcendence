
import { Component } from "react";
import logo from '../images/ICON.svg';
import logo_entier from '../images/TRANSCENDENCE.svg';
import logo_start from '../images/START.svg';
import '../App.css';


class Login extends Component {
  render() {
      return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <img src={logo_entier} className="trs_full" alt="logo_entier" /> 
        <div className="start_button">
          <img src={logo_start} className="start_image" alt="logo_start" />
          <a href={'http://localhost:3030/auth/login'}><button type="button" id="strt_btn"></button></a>
        </div>
      </header>
    </div>
    )}
}

export default Login