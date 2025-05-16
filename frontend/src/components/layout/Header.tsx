import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSignOutAlt, 
  faUser, 
  faBell,
  faBars,
  faHome,
  faGamepad,
  faTrophy,
  faInfoCircle,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import logo from '../../assets/logo.png';
import '../../styles/components/layout/Header.css';

interface HeaderProps {
  userName: string;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  userName, 
  activeTab, 
  onTabChange, 
  onLogout 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleTabChange = (tabId: string) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="header-brand">
          <div className="header-logo" onClick={() => handleTabChange('home')}>
            <img src={logo} alt="Triviality" />
          </div>
          <h1 onClick={() => handleTabChange('home')}>TRIVIALITY</h1>
        </div>
        
        {/* Navegación para pantallas grandes */}
        <nav className="header-nav">
          <ul>
            <li className={activeTab === 'home' ? 'active' : ''}>
              <button onClick={() => handleTabChange('home')}>Inicio</button>
            </li>
            <li className={activeTab === 'play' ? 'active' : ''}>
              <button onClick={() => handleTabChange('play')}>Jugar</button>
            </li>
            <li className={activeTab === 'leaderboard' ? 'active' : ''}>
              <button onClick={() => handleTabChange('leaderboard')}>Clasificación</button>
            </li>
            <li className={activeTab === 'about' ? 'active' : ''}>
              <button onClick={() => handleTabChange('about')}>Acerca de</button>
            </li>
          </ul>
        </nav>
        {/* Botón de perfil hecho botón, redireccion a Profile */}
        <div className="header-actions">
          <div className="user-profile" onClick={() => handleTabChange('profile')}>
            <div className="user-avatar"><FontAwesomeIcon icon={faUser} /></div>
              <span className="user-name">{userName}</span>
            </div>
          
          {/* Botón de menú hamburguesa para móviles */}
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} />
          </button>
        </div>
      </div>
      
      {/* Menú móvil desplegable */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <ul>
            <li className={activeTab === 'home' ? 'active' : ''}>
              <button onClick={() => handleTabChange('home')}>
                <FontAwesomeIcon icon={faHome} className="mobile-nav-icon" />
                Inicio
              </button>
            </li>
            <li className={activeTab === 'play' ? 'active' : ''}>
              <button onClick={() => handleTabChange('play')}>
                <FontAwesomeIcon icon={faGamepad} className="mobile-nav-icon" />
                Jugar
              </button>
            </li>
            <li className={activeTab === 'leaderboard' ? 'active' : ''}>
              <button onClick={() => handleTabChange('leaderboard')}>
                <FontAwesomeIcon icon={faTrophy} className="mobile-nav-icon" />
                Clasificación
              </button>
            </li>
            <li className={activeTab === 'about' ? 'active' : ''}>
              <button onClick={() => handleTabChange('about')}>
                <FontAwesomeIcon icon={faInfoCircle} className="mobile-nav-icon" />
                Acerca de
              </button>
            </li>
            <li className="mobile-logout">
              <button onClick={onLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} className="mobile-nav-icon" />
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="mobile-user-info">
          <div className="mobile-user-profile">
            <div className="user-avatar large">{userName.charAt(0)}</div>
            <span className="mobile-user-name">{userName}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 