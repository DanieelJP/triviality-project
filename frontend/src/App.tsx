import React, { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import LanguageSwitcher from './components/common/LanguageSwitcher';
import { getLocale, messages } from './locales';
import type { AvailableLocale } from './locales';
import { router } from './config/router';
import './App.css';

const App: React.FC = () => {
  const [locale, setLocale] = useState<AvailableLocale>(getLocale());

  useEffect(() => {
    // Actualizar el locale si cambia en localStorage
    const handleStorageChange = () => {
      setLocale(getLocale());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <IntlProvider 
      locale={locale} 
      messages={messages[locale]}
      defaultLocale="es"
    >
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
        <RouterProvider router={router} />
      </div>
    </IntlProvider>
  );
};

export default App;
