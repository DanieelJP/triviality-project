import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/components/Dashboard.css';
import { Layout } from '../../layout';
import daniImage from '../../../assets/dani.png';
import neilImage from '../../../assets/neil.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faHome, 
    faGamepad, 
    faTrophy, 
    faUser, 
    faInfoCircle, 
    faSignOutAlt, 
    faHardHat,
    faBullseye,
    faMedal,
    faChartBar,
    faDice,
    faClock,
    faStar,
    faUsers,
    faLightbulb,
    faCrown,
    faUserFriends
} from '@fortawesome/free-solid-svg-icons';

// Componente para la sección "Acerca de nosotros"
const AboutUs: React.FC = () => {
    return (
        <div className="about-section">
            <h2>
                <FontAwesomeIcon icon={faInfoCircle} className="section-icon" />
                Acerca de Triviality
            </h2>
            <p>Triviality es una plataforma de juegos de preguntas y respuestas diseñada para poner a prueba tus conocimientos en diversas áreas.</p>
            
            <div className="team-info">
                <h3>
                    <FontAwesomeIcon icon={faUsers} className="section-icon" />
                    Nuestro Equipo
                </h3>
                <div className="team-members">
                    <div className="team-member">
                        <div className="member-avatar">
                            <img src={daniImage} alt="Daniel Jiménez" className="member-image" />
                        </div>
                        <h4>Daniel Jiménez Parreño</h4>
                        <p>
                            <FontAwesomeIcon icon={faCrown} className="role-icon" />
                            Desarrollador & Co-fundador
                        </p>
                    </div>
                    <div className="team-member">
                        <div className="member-avatar">
                            <img src={neilImage} alt="Neil Vargas" className="member-image" />
                        </div>
                        <h4>Neil Vargas Calle</h4>
                        <p>
                            <FontAwesomeIcon icon={faCrown} className="role-icon" />
                            Desarrollador & Co-fundador
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="mission-section">
                <h3>
                    <FontAwesomeIcon icon={faLightbulb} className="section-icon" />
                    Nuestra Misión
                </h3>
                <p>Crear experiencias divertidas de aprendizaje que permitan a los usuarios expandir sus conocimientos mientras se divierten.</p>
            </div>
        </div>
    );
};

// Componente para la sección de proximamente
const ComingSoon: React.FC<{feature: string}> = ({ feature }) => {
    return (
        <div className="coming-soon-section">
            <div className="coming-soon-icon">
                <FontAwesomeIcon icon={faHardHat} />
            </div>
            <h2>{feature}</h2>
            <p>Esta función está en desarrollo y estará disponible próximamente.</p>
            <p>¡Vuelve pronto para descubrir las nuevas funcionalidades!</p>
        </div>
    );
};

// Componente para la página de inicio
const HomeContent: React.FC<{userName: string, startGame: () => void}> = ({ userName, startGame }) => {
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

// Componente para la página de juego
const PlayContent: React.FC<{startGame: () => void}> = ({ startGame }) => {
    return (
        <div className="play-container">
            <div className="play-header">
                <h1>Elige tu Modo de Juego</h1>
                <p className="play-description">Diferentes modos para desafiar tus conocimientos y habilidades</p>
            </div>
            
            <div className="dashboard-content-wrapper">
                <div className="game-modes">
                    <div className="game-mode-card" onClick={startGame}>
                        <div className="mode-icon">
                            <FontAwesomeIcon icon={faDice} />
                        </div>
                        <h3>Modo Clásico</h3>
                        <p>Responde 10 preguntas en tres niveles de dificultad.</p>
                        <button className="mode-button">
                            <FontAwesomeIcon icon={faGamepad} className="button-icon" />
                            Jugar
                        </button>
                    </div>
                    
                    <div className="game-mode-card disabled">
                        <div className="mode-icon">
                            <FontAwesomeIcon icon={faClock} />
                        </div>
                        <h3>Contrarreloj</h3>
                        <p>Responde tantas preguntas como puedas en 60 segundos.</p>
                        <div className="coming-soon-badge">Próximamente</div>
                    </div>
                    
                    <div className="game-mode-card disabled">
                        <div className="mode-icon">
                            <FontAwesomeIcon icon={faStar} />
                        </div>
                        <h3>Modo Desafío</h3>
                        <p>Enfréntate a los desafíos semanales y gana premios.</p>
                        <div className="coming-soon-badge">Próximamente</div>
                    </div>
                    
                    <div className="game-mode-card disabled">
                        <div className="mode-icon">
                            <FontAwesomeIcon icon={faUserFriends} />
                        </div>
                        <h3>Multijugador</h3>
                        <p>Compite en línea con tus amigos en una sala privada y demuestra quién es el mejor en trivia.</p>
                        <div className="coming-soon-badge">Próximamente</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<string>('home');
    const [userName, setUserName] = useState<string>('Usuario');

    // Verificar si el usuario está autenticado
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
        
        // Aquí normalmente obtendrías los datos del usuario desde una API
        // Por ahora solo usamos un nombre de usuario ficticio
        setUserName('Jugador');
    }, [navigate]);

    // Función para manejar el logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Función para iniciar el juego
    const startGame = () => {
        navigate('/trivia');
    };

    // Función para cambiar la pestaña activa
    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
    };

    // Renderizar el contenido basado en la pestaña activa
    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return <HomeContent userName={userName} startGame={startGame} />;
            case 'play':
                return <PlayContent startGame={startGame} />;
            case 'leaderboard':
                return (
                    <div className="leaderboard-container">
                        <div className="dashboard-content-wrapper">
                            <ComingSoon feature="Clasificación" />
                        </div>
                    </div>
                );
            case 'profile':
                return (
                    <div className="profile-container">
                        <div className="dashboard-content-wrapper">
                            <ComingSoon feature="Perfil de Usuario" />
                        </div>
                    </div>
                );
            case 'about':
                return (
                    <div className="about-container">
                        <div className="dashboard-content-wrapper">
                            <AboutUs />
                        </div>
                    </div>
                );
            default:
                return <div>Selecciona una pestaña</div>;
        }
    };

    return (
        <Layout
            userName={userName}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onLogout={handleLogout}
            useWrapper={false}
        >
            {renderContent()}
        </Layout>
    );
};

export default Dashboard; 