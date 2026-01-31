import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from '../theme';
import i18n from '../utils/i18n';

interface PreferencesContextProps {
  mode: 'light' | 'dark';
  toggleMode: () => void;
  language: 'en' | 'ar';
  setLanguage: (lng: 'en' | 'ar') => void;
  direction: 'ltr' | 'rtl';
}

const PreferencesContext = createContext<PreferencesContextProps | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read persisted preferences from localStorage when available.  Fall back
  // to sensible defaults otherwise.
  const [mode, setMode] = useState<'light' | 'dark'>(
    (localStorage.getItem('admin_theme_mode') as 'light' | 'dark') || 'light',
  );
  const [language, setLanguageState] = useState<'en' | 'ar'>(
    (localStorage.getItem('admin_language') as 'en' | 'ar') || 'en',
  );
  const direction: 'ltr' | 'rtl' = language === 'ar' ? 'rtl' : 'ltr';

  // Update i18n and DOM direction whenever the language changes.
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  const theme = useMemo(() => getTheme(mode, direction), [mode, direction]);

  const toggleMode = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('admin_theme_mode', next);
      return next;
    });
  };

  const setLanguagePref = (lng: 'en' | 'ar') => {
    setLanguageState(lng);
    localStorage.setItem('admin_language', lng);
  };

  return (
    <PreferencesContext.Provider value={{ mode, toggleMode, language, setLanguage: setLanguagePref, direction }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within PreferencesProvider');
  return ctx;
};