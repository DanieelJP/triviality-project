import React, { ReactNode } from 'react';
import '../../../styles/components/LoadingScreen.css';

interface LoadingScreenProps {
  isLoading: boolean;
  text?: string;
  backButton?: ReactNode;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  isLoading, 
  text = "Preparando tu trivia...",
  backButton
}) => {
  if (!isLoading) return null;

  return (
    <div className="loading-screen">
      {backButton && (
        <div className="loading-back-button">
          {backButton}
        </div>
      )}
      <div className="loading-content">
        <div className="loading-text">{text}</div>
        <div className="loading-waves">
          <div className="wave wave1"></div>
          <div className="wave wave2"></div>
          <div className="wave wave3"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
