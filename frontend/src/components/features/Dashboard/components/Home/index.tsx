import React from 'react';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faGamepad,
    faBullseye,
    faMedal,
    faChartBar 
} from '@fortawesome/free-solid-svg-icons';

interface HomeProps {
    userName: string;
    startGame: () => void;
}

const Home: React.FC<HomeProps> = ({ userName, startGame }) => {
    return (
        <div className="home-container">
            
                <div className="home-content">
                    <div className="welcome-area">
                        <div className="welcome-message">
                            <h1>¡Bienvenido a Triviality, {userName}!</h1>
                            <p className="hero-text">Pon a prueba tus conocimientos con nuestro divertido juego de preguntas y respuestas.</p>
                            <button className="play-button" onClick={startGame}>
                                <FontAwesomeIcon icon={faGamepad} className="button-icon" />
                                ¡Jugar Ahora!
                            </button>
                        </div>
                    </div>
                    
                    <div className="stats-area">
                        <div className="stats-card">
                            <h2 className="stats-title">Tus Estadísticas</h2>
                            <div className="stats-divider"></div>
                            
                            <div className="stat-item">
                                <div className="stat-icon-wrapper">
                                    <FontAwesomeIcon icon={faBullseye} className="stat-icon-custom" />
                                </div>
                                <div className="stat-value-large">0</div>
                                <div className="stat-label-custom">PARTIDAS JUGADAS</div>
                            </div>
                            
                            <div className="stats-divider"></div>
                            
                            <div className="stat-item">
                                <div className="stat-icon-wrapper">
                                    <FontAwesomeIcon icon={faMedal} className="stat-icon-custom" />
                                </div>
                                <div className="stat-value-large">0</div>
                                <div className="stat-label-custom">MEJOR PUNTUACIÓN</div>
                            </div>
                            
                            <div className="stats-divider"></div>
                            
                            <div className="stat-item">
                                <div className="stat-icon-wrapper">
                                    <FontAwesomeIcon icon={faChartBar} className="stat-icon-custom" />
                                </div>
                                <div className="stat-value-large">0%</div>
                                <div className="stat-label-custom">ACIERTOS</div>
                            </div>
                        </div>
                    </div>
                </div>
            
        </div>
    );
};

export default Home; 