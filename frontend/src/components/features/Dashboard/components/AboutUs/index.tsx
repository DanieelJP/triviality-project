import React from 'react';
import './AboutUs.css';
import daniImage from '../../../../../assets/dani.png';
import neilImage from '../../../../../assets/neil.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faInfoCircle,
    faUsers,
    faLightbulb,
    faCrown 
} from '@fortawesome/free-solid-svg-icons';

const AboutUs: React.FC = () => {
    return (
        <div className="about-container">
            <div className="dashboard-content-wrapper">
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
            </div>
        </div>
    );
};

export default AboutUs; 