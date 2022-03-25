import logo from './logoT.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Transcendance </h1>
        <button type="button" onClick={window.alert}>CONNECTE TOI !</button>
        
      </header>
    </div>
  );
}

export default App;
