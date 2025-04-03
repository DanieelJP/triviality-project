import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import TriviaGame from './components/TriviaGame';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trivia" element={<TriviaGame />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
