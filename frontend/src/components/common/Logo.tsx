import React from 'react';
import logo from '../../assets/logo.png';

interface LogoProps {
    inGame?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ inGame = false }) => (
    <div className={`logo-container ${inGame ? 'in-game' : ''}`}>
        <img src={logo} alt="Triviality Logo" className="logo-image" />
    </div>
); 