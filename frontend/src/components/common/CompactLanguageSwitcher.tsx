import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { LOCALES, setLocale } from '../../locales';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLanguage, faChevronDown } from '@fortawesome/free-solid-svg-icons';

interface CompactLanguageSwitcherProps {
  currentLocale: string;
}

const CompactLanguageSwitcher: React.FC<CompactLanguageSwitcherProps> = ({ currentLocale }) => {
  const [isOpen, setIsOpen] = useState(false);
  const intl = useIntl();

  const handleChangeLanguage = (locale: string) => {
    setLocale(locale);
    setIsOpen(false);
  };

  const getLanguageName = (locale: string) => {
    return intl.formatMessage({ id: `language.${locale}` });
  };

  // Obtener solo las iniciales del idioma actual y convertirlas a mayúsculas
  const getCurrentLocaleInitials = () => {
    const localeName = getLanguageName(currentLocale);
    return localeName.substring(0, 2).toUpperCase();
  };

  return (
    <div className="compact-language-switcher" style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '4px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          background: '#fff',
          cursor: 'pointer',
          fontSize: '11px',
          gap: '3px'
        }}
      >
        <FontAwesomeIcon icon={faLanguage} style={{ fontSize: '10px' }} />
        <span style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
          {getCurrentLocaleInitials()}
          <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: '8px', marginLeft: '2px' }} />
        </span>
      </button>
      
      {isOpen && (
        <div 
          style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            marginTop: '4px',
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            zIndex: 1000,
            minWidth: '120px'
          }}
        >
          {Object.values(LOCALES).map((locale) => (
            <div
              key={locale}
              onClick={() => handleChangeLanguage(locale)}
              style={{
                padding: '6px 12px',
                cursor: 'pointer',
                backgroundColor: currentLocale === locale ? '#f0f0f0' : 'transparent',
                fontWeight: currentLocale === locale ? 'bold' : 'normal',
                borderBottom: '1px solid #eee',
                fontSize: '12px'
              }}
            >
              {getLanguageName(locale)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompactLanguageSwitcher; 