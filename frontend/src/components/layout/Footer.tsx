import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGithub,
} from '@fortawesome/free-brands-svg-icons';
import { 
  faEnvelope, 
  faQuestion 
} from '@fortawesome/free-solid-svg-icons';
import '../../styles/components/layout/Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
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
              <li><a href="#" onClick={(e) => e.preventDefault()}>Inicio</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Jugar</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Clasificación</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Perfil</a></li>
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
                <a href="#" onClick={(e) => e.preventDefault()}>Ayuda y Soporte</a>
              </li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Síguenos</h3>
            <div className="social-icons">
              <a href="https://github.com/DanieelJP/triviality-project" className="social-icon" onClick={(e) => e.preventDefault()}>
                <FontAwesomeIcon icon={faGithub} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} Triviality. Todos los derechos reservados.</p>
          <ul className="footer-legal">
            <li><a href="#" onClick={(e) => e.preventDefault()}>Términos de Servicio</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>Política de Privacidad</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 