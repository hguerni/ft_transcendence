import logo from './ICON.svg';
import logo_entier from './TRANSCENDENCE.svg';
import logo_start from './START.svg';
import './App.css';

function App() {
  function handleClick() {
    alert('clic');
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <img src={logo_entier} className="trs_full" alt="logo_entier" /> 
        <div className="start_button">
          <img src={logo_start} className="start_image" alt="logo_start" />
          <button type="button" id="strt_btn"
          onClick={handleClick}></button>
        </div>
      </header>
    </div>
  );
}

export default App;
