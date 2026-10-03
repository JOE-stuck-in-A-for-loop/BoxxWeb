import { useState, useEffect, useCallback, createContext, useContext } from 'react';

import en from './locals/en.json';
import zh from './locals/zh.json';

const LOCALE_MAP = { en, zh };

// Detect browser language, fallback to 'en'
function detectLocale() {
  const lang = navigator.language || navigator.languages?.[0] || 'en';
  if (lang.startsWith('zh')) return 'zh';
  return 'en';
}

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    return localStorage.getItem('boxx_locale') || detectLocale();
  });

  const setLocale = useCallback((l) => {  
    localStorage.setItem('boxx_locale', l);
    setLocaleState(l);
  }, []);

  const t = useCallback(
    (path, params = {}) => {
      const keys = path.split('.');
      let val = LOCALE_MAP[locale];
      for (const k of keys) {
        if (val == null) return path;
        val = val[k];
      }
      if (val == null) return path;
      // If it's a string, replace {param} placeholders
      if (typeof val === 'string') {
        return val.replace(/\{(\w+)\}/g, (_, key) => params[key] ?? `{${key}}`);
      }
      // Pass through arrays (for rule lists) and other values
      return val;
    },
    [locale],
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}

export default I18nContext;