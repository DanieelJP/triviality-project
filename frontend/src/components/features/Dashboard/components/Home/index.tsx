import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faGamepad,
    faStar,
    faBullseye,
    faClock,
    faPlay 
} from '@fortawesome/free-solid-svg-icons';
import axios from '../../../../../config/axios';

interface HomeProps {
    userName: string;
    startGame: () => void;
}

interface UserStats {
    total_games: number;
    total_points: number;
    accuracy: number;
    avg_response_time: number;
}

const Home: React.FC<HomeProps> = ({ userName, startGame }) => {
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('/api/profile');
                setStats(response.data.stats);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="home-container">
            <div className="home-content">
                <div className="welcome-area">
                    <div className="welcome-message">
                        <h1>
                            <FormattedMessage 
                                id="dashboard.welcome" 
                                defaultMessage="¡Bienvenido, {name}!"
                                values={{ name: userName }}
                            />
                        </h1>
                        <p className="hero-text">
                            <FormattedMessage 
                                id="app.testKnowledge" 
                                defaultMessage="Pon a prueba tus conocimientos con nuestro divertido juego de preguntas y respuestas."
                            />
                        </p>
                        <button className="play-button" onClick={startGame}>
                            <FontAwesomeIcon icon={faPlay} />
                            <FormattedMessage 
                                id="dashboard.playNow" 
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
                            <FontAwesomeIcon icon={faGamepad} className="stat-icon" />
                            <div className="stat-info">
                                <span className="stat-value">
                                    {loading ? '...' : stats?.total_games || 0}
                                </span>
                                <FormattedMessage 
                                    id="dashboard.games" 
                                    defaultMessage="PARTIDAS JUGADAS"
                                />
                            </div>
                        </div>
                        
                        <div className="stats-divider"></div>
                        
                        <div className="stat-item">
                            <FontAwesomeIcon icon={faStar} className="stat-icon" />
                            <div className="stat-info">
                                <span className="stat-value">
                                    {loading ? '...' : stats?.total_points || 0}
                                </span>
                                <FormattedMessage 
                                    id="dashboard.bestScore" 
                                    defaultMessage="MEJOR PUNTUACIÓN"
                                />
                            </div>
                        </div>
                        
                        <div className="stats-divider"></div>
                        
                        <div className="stat-item">
                            <FontAwesomeIcon icon={faBullseye} className="stat-icon" />
                            <div className="stat-info">
                                <span className="stat-value">
                                    {loading ? '...' : `${stats?.accuracy || 0}%`}
                                </span>
                                <FormattedMessage 
                                    id="dashboard.accuracy" 
                                    defaultMessage="PRECISIÓN"
                                />
                            </div>
                        </div>
                        
                        <div className="stats-divider"></div>
                        
                        <div className="stat-item">
                            <FontAwesomeIcon icon={faClock} className="stat-icon" />
                            <div className="stat-info">
                                <span className="stat-value">
                                    {loading ? '...' : `${stats?.avg_response_time.toFixed(1)}s` || '0s'}
                                </span>
                                <FormattedMessage 
                                    id="dashboard.avgTime" 
                                    defaultMessage="TIEMPO PROMEDIO"
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