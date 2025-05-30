import { TranslationMessages } from '../types/translations';
import en from './en.json';
import ca from './ca.json';
import es from './es.json';

const LOCALE_STORAGE_KEY = 'preferredLocale';
const DEFAULT_LOCALE = 'es';

export const availableLocales = ['en', 'ca', 'es'] as const;
export type AvailableLocale = typeof availableLocales[number];

// Procesamos los mensajes para asegurarnos de que solo contienen strings
const processMessages = (messages: Record<string, any>): TranslationMessages => {
  return Object.entries(messages).reduce((acc, [key, value]) => {
    if (typeof value === 'string') {
      acc[key] = value;
    }
    return acc;
  }, {} as TranslationMessages);
};

export const messages: Record<AvailableLocale, TranslationMessages> = {
  en: processMessages(en),
  ca: processMessages(ca),
  es: processMessages(es),
};

export const getLocale = (): AvailableLocale => {
  const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (storedLocale && availableLocales.includes(storedLocale as AvailableLocale)) {
    return storedLocale as AvailableLocale;
  }

  const browserLocale = navigator.language.split('-')[0];
  if (availableLocales.includes(browserLocale as AvailableLocale)) {
    return browserLocale as AvailableLocale;
  }

  return DEFAULT_LOCALE;
};

export const setLocale = (locale: AvailableLocale): void => {
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  window.dispatchEvent(new Event('storage'));
};

export const isValidLocale = (locale: string): locale is AvailableLocale => {
  return availableLocales.includes(locale as AvailableLocale);
}; 