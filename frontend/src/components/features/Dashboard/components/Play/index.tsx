import React from 'react';
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
                    <h1>Elige tu Modo de Juego</h1>
                    <p className="play-description">Diferentes modos para desafiar tus conocimientos y habilidades</p>
                </div>
                
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

export default Play; 