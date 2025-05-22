import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { LOCALES, setLocale } from '../../locales';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLanguage, faChevronDown } from '@fortawesome/free-solid-svg-icons';

interface LanguageSwitcherProps {
  currentLocale: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLocale }) => {
  const [isOpen, setIsOpen] = useState(false);
  const intl = useIntl();

  const handleChangeLanguage = (locale: string) => {
    setLocale(locale);
    setIsOpen(false);
  };

  const getLanguageName = (locale: string) => {
    return intl.formatMessage({ id: `language.${locale}` });
  };

  return (
    <div className="language-switcher" style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 12px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          background: '#fff',
          cursor: 'pointer',
          fontSize: '14px',
          gap: '8px'
        }}
      >
        <FontAwesomeIcon icon={faLanguage} />
        <span>
          <FormattedMessage id="language.select" defaultMessage="Idioma" />: {getLanguageName(currentLocale)}
        </span>
        <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: '12px' }} />
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
            minWidth: '150px'
          }}
        >
          {Object.values(LOCALES).map((locale) => (
            <div
              key={locale}
              onClick={() => handleChangeLanguage(locale)}
              style={{
                padding: '8px 16px',
                cursor: 'pointer',
                backgroundColor: currentLocale === locale ? '#f0f0f0' : 'transparent',
                fontWeight: currentLocale === locale ? 'bold' : 'normal',
                borderBottom: '1px solid #eee'
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

export default LanguageSwitcher; 