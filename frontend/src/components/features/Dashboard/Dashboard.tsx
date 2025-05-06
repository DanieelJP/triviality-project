import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/components/Dashboard.css';
import { Logo } from '../../common/Logo';
import logo from '../../../assets/logo.png';
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

// Las interfaces para los tabs
interface Tab {
    id: string;
    label: string;
    icon: any;
}

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

    // Definición de las pestañas con iconos de Font Awesome
    const tabs: Tab[] = [
        { id: 'home', label: 'Inicio', icon: faHome },
        { id: 'play', label: 'Jugar', icon: faGamepad },
        { id: 'leaderboard', label: 'Clasificación', icon: faTrophy },
        { id: 'profile', label: 'Perfil', icon: faUser },
        { id: 'about', label: 'Acerca de', icon: faInfoCircle },
    ];

    // Función para manejar el logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Función para iniciar el juego
    const startGame = () => {
        navigate('/trivia');
    };

    // Renderizar el contenido basado en la pestaña activa
    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return (
                    <div className="dashboard-home">
                        <h1>¡Bienvenido, {userName}!</h1>
                        <p className="welcome-text">
                            Pon a prueba tus conocimientos con nuestro divertido juego de preguntas y respuestas.
                        </p>
                        
                        <div className="quick-stats">
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <FontAwesomeIcon icon={faBullseye} />
                                </div>
                                <div className="stat-value">0</div>
                                <div className="stat-label">Partidas jugadas</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <FontAwesomeIcon icon={faMedal} />
                                </div>
                                <div className="stat-value">0</div>
                                <div className="stat-label">Mejor puntuación</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <FontAwesomeIcon icon={faChartBar} />
                                </div>
                                <div className="stat-value">0%</div>
                                <div className="stat-label">Aciertos</div>
                            </div>
                        </div>
                        
                        <button className="play-button" onClick={startGame}>
                            <FontAwesomeIcon icon={faGamepad} className="button-icon" />
                            ¡Jugar Ahora!
                        </button>
                    </div>
                );
            case 'play':
                return (
                    <div className="play-section">
                        <h2>
                            <FontAwesomeIcon icon={faGamepad} className="section-icon" />
                            Elige tu modo de juego
                        </h2>
                        
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
                );
            case 'leaderboard':
                return <ComingSoon feature="Clasificación" />;
            case 'profile':
                return <ComingSoon feature="Perfil de Usuario" />;
            case 'about':
                return <AboutUs />;
            default:
                return <div>Selecciona una pestaña</div>;
        }
    };

    return (
        <div className="dashboard-container">
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <div className="dashboard-logo">
                        <img src={logo} alt="Triviality" className="dashboard-logo-image" />
                    </div>
                    <h2>Triviality</h2>
                </div>
                
                <nav className="sidebar-nav">
                    <ul>
                        {tabs.map((tab) => (
                            <li key={tab.id} className={activeTab === tab.id ? 'active' : ''}>
                                <button onClick={() => setActiveTab(tab.id)}>
                                    <span className="tab-icon">
                                        <FontAwesomeIcon icon={tab.icon} />
                                    </span>
                                    <span className="tab-label">{tab.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
                
                <div className="sidebar-footer">
                    <button className="logout-button" onClick={handleLogout}>
                        <span className="logout-icon">
                            <FontAwesomeIcon icon={faSignOutAlt} />
                        </span>
                        <span className="logout-text">Cerrar sesión</span>
                    </button>
                </div>
            </aside>
            
            <main className="dashboard-content">
                <header className="dashboard-header">
                    <h1>{tabs.find(tab => tab.id === activeTab)?.label || 'Dashboard'}</h1>
                    <div className="user-info">
                        <div className="user-avatar">{userName.charAt(0)}</div>
                        <span>{userName}</span>
                    </div>
                </header>
                
                <div className="dashboard-main-content">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default Dashboard; 