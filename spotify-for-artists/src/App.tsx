import React from 'react';
import logo from './logo.svg';
import './App.css';
import { SPButton } from './components/button/sp-button.component';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
                <SPButton
                    onClick={() => {}}
                >
                    Boton
                </SPButton>
            </header>
        </div>
    );
}

export default App;
