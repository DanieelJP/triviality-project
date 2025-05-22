import enMessages from './en.json';
import caMessages from './ca.json';
import esMessages from './es.json';

export const LOCALES = {
  ENGLISH: 'en',
  CATALAN: 'ca',
  SPANISH: 'es'
};

export const messages = {
  [LOCALES.ENGLISH]: enMessages,
  [LOCALES.CATALAN]: caMessages,
  [LOCALES.SPANISH]: esMessages
};

export const defaultLocale = LOCALES.SPANISH;

export const getLocale = (): string => {
  const savedLocale = localStorage.getItem('locale');
  
  if (savedLocale && Object.values(LOCALES).includes(savedLocale as any)) {
    return savedLocale;
  }
  
  // Detectar el idioma del navegador
  const browserLang = navigator.language.split('-')[0];
  
  if (browserLang === 'ca') {
    return LOCALES.CATALAN;
  } else if (browserLang === 'en') {
    return LOCALES.ENGLISH;
  }
  
  return defaultLocale;
};

export const setLocale = (locale: string): void => {
  localStorage.setItem('locale', locale);
  window.location.reload();
}; 