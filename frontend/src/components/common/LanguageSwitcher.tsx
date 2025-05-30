import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { setLocale, availableLocales } from '../../locales';
import type { AvailableLocale } from '../../locales';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLanguage, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import './LanguageSwitcher.css';

interface LanguageSwitcherProps {
  currentLocale: AvailableLocale;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLocale }) => {
  const [isOpen, setIsOpen] = useState(false);
  const intl = useIntl();

  const handleChangeLanguage = (locale: AvailableLocale) => {
    setLocale(locale);
    setIsOpen(false);
  };

  const getLanguageName = (locale: AvailableLocale) => {
    return intl.formatMessage({ id: `language.${locale}` });
  };

  return (
    <div className="language-switcher">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="language-switcher-button"
      >
        <FontAwesomeIcon icon={faLanguage} />
        <span>
          <FormattedMessage id="language.select" defaultMessage="Idioma" />: {getLanguageName(currentLocale)}
        </span>
        <FontAwesomeIcon icon={faChevronDown} className="chevron-icon" />
      </button>
      
      {isOpen && (
        <div className="language-dropdown">
          {availableLocales.map((locale) => (
            <div
              key={locale}
              onClick={() => handleChangeLanguage(locale)}
              className={`language-option ${currentLocale === locale ? 'active' : ''}`}
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