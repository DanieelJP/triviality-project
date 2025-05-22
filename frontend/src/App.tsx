import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { Home, Login, Signup, TriviaGame, Dashboard } from './components/features';
import LanguageSwitcher from './components/common/LanguageSwitcher';
import { getLocale, messages } from './locales';
import './App.css';

const App: React.FC = () => {
  const [locale, setLocale] = useState(getLocale());

  useEffect(() => {
    // Actualizar el locale si cambia en localStorage
    const handleStorageChange = () => {
      setLocale(getLocale());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <Router>
        <div className="app-container">
          <div 
            className="language-switcher-container" 
            style={{ 
              position: 'fixed', 
              top: '20px', 
              right: '20px',
              zIndex: 1000,
              background: 'rgba(255, 255, 255, 0.9)',
              padding: '5px',
              borderRadius: '5px',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
            }}
          >
            <LanguageSwitcher currentLocale={locale} />
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/trivia" element={<TriviaGame />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </IntlProvider>
  );
};

export default App;
