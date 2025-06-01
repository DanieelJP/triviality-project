import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
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
import CompactLanguageSwitcher from '../common/CompactLanguageSwitcher';
import { getLocale } from '../../locales';

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
  const [currentLocale, setCurrentLocale] = useState(getLocale());

  // Actualizar el estado cuando cambie el idioma
  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentLocale(getLocale());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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
              <button onClick={() => handleTabChange('home')}>
                <FormattedMessage id="nav.home" defaultMessage="Inicio" />
              </button>
            </li>
            <li className={activeTab === 'play' ? 'active' : ''}>
              <button onClick={() => handleTabChange('play')}>
                <FormattedMessage id="nav.play" defaultMessage="Jugar" />
              </button>
            </li>
            <li className={activeTab === 'leaderboard' ? 'active' : ''}>
              <button onClick={() => handleTabChange('leaderboard')}>
                <FormattedMessage id="nav.leaderboard" defaultMessage="Clasificación" />
              </button>
            </li>
            <li className={activeTab === 'about' ? 'active' : ''}>
              <button onClick={() => handleTabChange('about')}>
                <FormattedMessage id="nav.about" defaultMessage="Acerca de" />
              </button>
            </li>
          </ul>
        </nav>
        {/* Botón de perfil hecho botón, redireccion a Profile */}
        <div className="header-actions">
          {/* Selector de idioma compacto */}
          <div className="header-language-switcher">
            <CompactLanguageSwitcher currentLocale={currentLocale} />
          </div>
          
          <div className="user-profile" onClick={() => handleTabChange('profile')}>
            <div className="user-avatar"><FontAwesomeIcon icon={faUser} /></div>
              <span className="user-name">{userName}</span>
            </div>
          
          {/* Botón de logout solo visible en escritorio */}
          <button className="logout-header-btn" onClick={onLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span className="logout-text">
              <FormattedMessage id="nav.logout" defaultMessage="Log out" />
            </span>
          </button>
          
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
                <FormattedMessage id="nav.home" defaultMessage="Inicio" />
              </button>
            </li>
            <li className={activeTab === 'play' ? 'active' : ''}>
              <button onClick={() => handleTabChange('play')}>
                <FontAwesomeIcon icon={faGamepad} className="mobile-nav-icon" />
                <FormattedMessage id="nav.play" defaultMessage="Jugar" />
              </button>
            </li>
            <li className={activeTab === 'leaderboard' ? 'active' : ''}>
              <button onClick={() => handleTabChange('leaderboard')}>
                <FontAwesomeIcon icon={faTrophy} className="mobile-nav-icon" />
                <FormattedMessage id="nav.leaderboard" defaultMessage="Clasificación" />
              </button>
            </li>
            <li className={activeTab === 'about' ? 'active' : ''}>
              <button onClick={() => handleTabChange('about')}>
                <FontAwesomeIcon icon={faInfoCircle} className="mobile-nav-icon" />
                <FormattedMessage id="nav.about" defaultMessage="Acerca de" />
              </button>
            </li>
            <li className="mobile-logout">
              <button onClick={onLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} className="mobile-nav-icon" />
                <FormattedMessage id="nav.logout" defaultMessage="Cerrar Sesión" />
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="mobile-user-info">
          <div className="mobile-user-profile" onClick={() => handleTabChange('profile')}>
            <div className="user-avatar large">{userName.charAt(0)}</div>
            <span className="mobile-user-name">{userName}</span>
          </div>
          {/* Selector de idioma en menú móvil */}
          <div className="mobile-language-switcher">
            <CompactLanguageSwitcher currentLocale={currentLocale} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 