import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
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
    const location = useLocation();
    const intl = useIntl();
    const [userName, setUserName] = useState<string>('Usuario');

    // Determinar la pestaña activa basada en la ruta
    const getActiveTab = () => {
        const path = location.pathname.split('/').pop() || 'home';
        return path === 'dashboard' ? 'home' : path;
    };

    const [activeTab, setActiveTab] = useState<string>(getActiveTab());

    // Actualizar la pestaña activa cuando cambia la ruta
    useEffect(() => {
        setActiveTab(getActiveTab());
    }, [location]);

    // Verificar si el usuario está autenticado
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
        
        // Aquí normalmente obtendrías los datos del usuario desde una API
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            setUserName(user.name || 'Jugador');
        }
    }, [navigate]);

    // Función para manejar el logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Función para iniciar el juego
    const startGame = () => {
        navigate('/trivia');
    };

    // Función para cambiar la pestaña activa
    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        navigate(tabId === 'home' ? '/dashboard' : `/dashboard/${tabId}`);
    };

    return (
        <Layout
            userName={userName}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onLogout={handleLogout}
            useWrapper={false}
        >
            <Routes>
                <Route index element={<Home userName={userName} startGame={startGame} />} />
                <Route path="play" element={<Play startGame={startGame} />} />
                <Route path="leaderboard" element={<Leaderboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="about" element={<AboutUs />} />
            </Routes>
        </Layout>
    );
};

export default Dashboard; 