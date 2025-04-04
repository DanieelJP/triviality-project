import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
    const navigate = useNavigate();

    const handleStartGame = () => {
        navigate('/trivia');
    };

    return (
        <div className="home-container">
            <div className="home-content">
                <h1 className="home-title">¡Bienvenido a Triviality!</h1>
                <button 
                    className="start-game-button"
                    onClick={handleStartGame}
                >
                    ¡Comenzar Juego!
                </button>
            </div>
        </div>
    );
};

export default Home; 