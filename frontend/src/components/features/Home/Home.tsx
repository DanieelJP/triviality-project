import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/components/Home.css';

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <div className="home-content">
                <h1 className="home-title">¡Bienvenido a Triviality!</h1>
                <p className="home-subtitle">El juego de preguntas y respuestas más divertido</p>
                <div className="button-container">
                    <button onClick={() => navigate('/login')} className="home-button">
                        Iniciar Sesión
                    </button>
                    <button onClick={() => navigate('/signup')} className="home-button secondary">
                        Registrarse
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home; 