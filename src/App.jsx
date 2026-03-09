import React from 'react';
import Header from './components/Header.jsx';
import ControlPanel from './components/ControlPanel.jsx';
import PuzzleBoard from './components/PuzzleBoard.jsx';
import SolutionViewer from './components/SolutionViewer.jsx';
import ResultPanel from './components/ResultPanel.jsx';
import './styles/global.css';

function App() {
  return (
    <div className="app">
      <Header />
      <ControlPanel />
      
      <SolutionViewer />
      <ResultPanel />
    </div>
  );
}

export default App;
