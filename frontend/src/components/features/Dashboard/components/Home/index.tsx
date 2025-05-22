import React from 'react';
import { FormattedMessage } from 'react-intl';
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
                            <h1>
                                <FormattedMessage 
                                    id="dashboard.welcome" 
                                    defaultMessage="¡Bienvenido a Triviality, {userName}!"
                                    values={{ userName }}
                                />
                            </h1>
                            <p className="hero-text">
                                <FormattedMessage 
                                    id="app.testKnowledge" 
                                    defaultMessage="Pon a prueba tus conocimientos con nuestro divertido juego de preguntas y respuestas."
                                />
                            </p>
                            <button className="play-button" onClick={startGame}>
                                <FontAwesomeIcon icon={faGamepad} className="button-icon" />
                                <FormattedMessage 
                                    id="game.playNow" 
                                    defaultMessage="¡Jugar Ahora!"
                                />
                            </button>
                        </div>
                    </div>
                    
                    <div className="stats-area">
                        <div className="stats-card">
                            <h2 className="stats-title">
                                <FormattedMessage 
                                    id="dashboard.stats" 
                                    defaultMessage="Tus Estadísticas"
                                />
                            </h2>
                            <div className="stats-divider"></div>
                            
                            <div className="stat-item">
                                <div className="stat-icon-wrapper">
                                    <FontAwesomeIcon icon={faBullseye} className="stat-icon-custom" />
                                </div>
                                <div className="stat-value-large">0</div>
                                <div className="stat-label-custom">
                                    <FormattedMessage 
                                        id="dashboard.games" 
                                        defaultMessage="PARTIDAS JUGADAS"
                                    />
                                </div>
                            </div>
                            
                            <div className="stats-divider"></div>
                            
                            <div className="stat-item">
                                <div className="stat-icon-wrapper">
                                    <FontAwesomeIcon icon={faMedal} className="stat-icon-custom" />
                                </div>
                                <div className="stat-value-large">0</div>
                                <div className="stat-label-custom">
                                    <FormattedMessage 
                                        id="dashboard.bestScore" 
                                        defaultMessage="MEJOR PUNTUACIÓN"
                                    />
                                </div>
                            </div>
                            
                            <div className="stats-divider"></div>
                            
                            <div className="stat-item">
                                <div className="stat-icon-wrapper">
                                    <FontAwesomeIcon icon={faChartBar} className="stat-icon-custom" />
                                </div>
                                <div className="stat-value-large">0%</div>
                                <div className="stat-label-custom">
                                    <FormattedMessage 
                                        id="dashboard.accuracy" 
                                        defaultMessage="ACIERTOS"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            
        </div>
    );
};

export default Home; 