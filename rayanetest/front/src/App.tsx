import logo from './ICON.svg';
import logo_entier from './TRANSCENDENCE.svg';
import logo_start from './START.svg';
import './App.css';

function App() {
  function handleClick() {
    alert('clicked');
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <img src={logo_entier} className="App-logo2" alt="logo_entier" />
        <img src={logo_start} className="App-logo3" alt="logo_start" />
        <button type="button" onClick={handleClick}>hahahah</button>
      </header>
    </div>
  );
}

export default App;
