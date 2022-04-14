import logo from './ICON.svg';
import logo_entier from './TRANSCENDENCE.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <img src={logo_entier} className="App-logo2" alt="logo_entier" />

        <button type="button" onClick={window.alert}>CONNECTE TOI !</button>
        
      </header>
    </div>
  );
}

export default App;
