import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGithub,
} from '@fortawesome/free-brands-svg-icons';
import { 
  faEnvelope, 
  faQuestion,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import '../../styles/components/layout/Footer.css';

interface FooterProps {
  onTabChange?: (tabId: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onTabChange }) => {
  const currentYear = new Date().getFullYear();
  
  const handleTabClick = (tabId: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onTabChange) {
      onTabChange(tabId);
      // Hacer scroll hacia arriba para mejor experiencia de usuario
      window.scrollTo(0, 0);
    }
  };
  
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Triviality</h3>
            <p>La plataforma de juegos de preguntas y respuestas para poner a prueba tus conocimientos de manera divertida.</p>
          </div>
          
          <div className="footer-section">
            <h3>Enlaces Rápidos</h3>
            <ul className="footer-links">
              <li><a href="#" onClick={(e) => handleTabClick('home', e)}>Inicio</a></li>
              <li><a href="#" onClick={(e) => handleTabClick('play', e)}>Jugar</a></li>
              <li><a href="#" onClick={(e) => handleTabClick('leaderboard', e)}>Clasificación</a></li>
              <li><a href="#" onClick={(e) => handleTabClick('profile', e)}>Perfil</a></li>
              <li><a href="#" onClick={(e) => handleTabClick('about', e)}>Acerca de</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Contacto</h3>
            <ul className="footer-contact">
              <li>
                <FontAwesomeIcon icon={faEnvelope} />
                <a href="mailto:triviality@gmail.com">triviality@gmail.com</a>
              </li>
              <li>
                <FontAwesomeIcon icon={faQuestion} />
                <a href="#" onClick={(e) => handleTabClick('about', e)}>Ayuda y Soporte</a>
              </li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Síguenos</h3>
            <div className="social-icons">
              <a href="https://github.com/DanieelJP/triviality-project" className="social-icon" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faGithub} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} Triviality. Todos los derechos reservados.</p>
          <ul className="footer-legal">
            <li><a href="#" onClick={(e) => handleTabClick('about', e)}>Términos de Servicio</a></li>
            <li><a href="#" onClick={(e) => handleTabClick('about', e)}>Política de Privacidad</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 