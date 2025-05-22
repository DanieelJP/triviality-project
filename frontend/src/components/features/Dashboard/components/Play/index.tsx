import React from 'react';
import { FormattedMessage } from 'react-intl';
import './Play.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faGamepad, 
    faDice,
    faClock,
    faUserFriends
} from '@fortawesome/free-solid-svg-icons';

interface PlayProps {
    startGame: () => void;
}

const Play: React.FC<PlayProps> = ({ startGame }) => {
    return (
        <div className="play-container">
            <div className="dashboard-content-wrapper">
                <div className="play-header">
                    <h1>
                        <FormattedMessage id="play.title" defaultMessage="Elige tu Modo de Juego" />
                    </h1>
                    <p className="play-description">
                        <FormattedMessage id="play.description" defaultMessage="Diferentes modos para desafiar tus conocimientos y habilidades" />
                    </p>
                </div>
                
                <div className="game-modes">
                    <div className="game-mode-card" onClick={startGame}>
                        <div className="mode-icon">
                            <FontAwesomeIcon icon={faDice} />
                        </div>
                        <h3>
                            <FormattedMessage id="play.classic.title" defaultMessage="Modo Clásico" />
                        </h3>
                        <p>
                            <FormattedMessage id="play.classic.description" defaultMessage="Responde 10 preguntas en tres niveles de dificultad." />
                        </p>
                        <button className="mode-button">
                            <FontAwesomeIcon icon={faGamepad} className="button-icon" />
                            <FormattedMessage id="play.button" defaultMessage="Jugar" />
                        </button>
                    </div>
                    
                    <div className="game-mode-card disabled">
                        <div className="mode-icon">
                            <FontAwesomeIcon icon={faClock} />
                        </div>
                        <h3>
                            <FormattedMessage id="play.timed.title" defaultMessage="Contrarreloj" />
                        </h3>
                        <p>
                            <FormattedMessage id="play.timed.description" defaultMessage="Responde tantas preguntas como puedas en 60 segundos." />
                        </p>
                        <div className="coming-soon-badge">
                            <FormattedMessage id="play.comingSoon" defaultMessage="Próximamente" />
                        </div>
                    </div>
                    
                    <div className="game-mode-card disabled">
                        <div className="mode-icon">
                            <FontAwesomeIcon icon={faUserFriends} />
                        </div>
                        <h3>
                            <FormattedMessage id="play.multiplayer.title" defaultMessage="Multijugador" />
                        </h3>
                        <p>
                            <FormattedMessage id="play.multiplayer.description" defaultMessage="Compite en línea con tus amigos en una sala privada y demuestra quién es el mejor en trivia." />
                        </p>
                        <div className="coming-soon-badge">
                            <FormattedMessage id="play.comingSoon" defaultMessage="Próximamente" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Play; 