import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSignOutAlt, 
  faUser, 
  faBell
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
  return (
    <header className="main-header">
      <div className="header-container">
        <div className="header-brand">
          <div className="header-logo" onClick={() => onTabChange('home')}>
            <img src={logo} alt="Triviality" />
          </div>
          <h1 onClick={() => onTabChange('home')}>TRIVIALITY</h1>
        </div>
        
        <nav className="header-nav">
          <ul>
            <li className={activeTab === 'home' ? 'active' : ''}>
              <button onClick={() => onTabChange('home')}>Inicio</button>
            </li>
            <li className={activeTab === 'play' ? 'active' : ''}>
              <button onClick={() => onTabChange('play')}>Jugar</button>
            </li>
            <li className={activeTab === 'leaderboard' ? 'active' : ''}>
              <button onClick={() => onTabChange('leaderboard')}>Clasificación</button>
            </li>
            <li className={activeTab === 'about' ? 'active' : ''}>
              <button onClick={() => onTabChange('about')}>Acerca de</button>
            </li>
          </ul>
        </nav>
        
        <div className="header-actions">
          <div className="notification-icon">
            <FontAwesomeIcon icon={faBell} />
            <span className="notification-badge">0</span>
          </div>
          
          <div className="user-profile">
            <div className="user-avatar">{userName.charAt(0)}</div>
            <span className="user-name">{userName}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 