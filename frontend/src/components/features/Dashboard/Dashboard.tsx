import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../layout';
import '../../../styles/components/DashboardBase.css';

// Importar los componentes modularizados
import Home from './components/Home';
import Play from './components/Play';
import Leaderboard from './components/Leaderboard';
import Profile from './components/Profile';
import AboutUs from './components/AboutUs';

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
                return <Home userName={userName} startGame={startGame} />;
            case 'play':
                return <Play startGame={startGame} />;
            case 'leaderboard':
                return <Leaderboard />;
            case 'profile':
                return <Profile />;
            case 'about':
                return <AboutUs />;
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