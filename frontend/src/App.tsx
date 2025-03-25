import React from 'react';
import './App.css';
import TriviaGame from './components/TriviaGame';

function App() {
  return (
    <div className="App">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold text-center">Triviality</h1>
      </header>
      <main className="container mx-auto py-8">
        <TriviaGame />
      </main>
    </div>
  );
}

export default App;
