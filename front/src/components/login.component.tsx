
import { Component } from "react";
import logo from '../logoT.png';
import '../App.css';


class Login extends Component {
  render() {
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1>Transcendance </h1>
            <a href={'http://localhost:3030/auth/login'}> <button type="button">CONNECTE TOI !</button></a>
          </header>
        </div>
    )}
}

export default Login