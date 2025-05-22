import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import '../../../styles/components/Home.css';

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="home">
            <div className="home-content">
                <h1 className="home-title">
                    <FormattedMessage id="app.title" defaultMessage="¡Bienvenido a Triviality!" />
                </h1>
                <p className="home-subtitle">
                    <FormattedMessage id="app.subtitle" defaultMessage="El juego de preguntas y respuestas más divertido" />
                </p>
                <div className="button-container">
                    <button onClick={() => navigate('/login')} className="home-button">
                        <FormattedMessage id="nav.login" defaultMessage="Iniciar Sesión" />
                    </button>
                    <button onClick={() => navigate('/signup')} className="home-button secondary">
                        <FormattedMessage id="nav.signup" defaultMessage="Registrarse" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home; 