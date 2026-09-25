"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Locale = 'id' | 'en';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('id');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Get locale from localStorage on mount
    const saved = (localStorage.getItem('locale') as Locale) || 'id';
    setLocaleState(saved);
    
    // Update HTML lang attribute
    document.documentElement.lang = saved;
    
    setMounted(true);

    // Listen for locale changes from LanguageSwitcher
    const handleLocaleChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ locale: Locale }>;
      const newLocale = customEvent.detail.locale;
      setLocaleState(newLocale);
      document.documentElement.lang = newLocale;
      localStorage.setItem('locale', newLocale);
    };

    window.addEventListener('localeChange', handleLocaleChange);
    return () => window.removeEventListener('localeChange', handleLocaleChange);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    document.documentElement.lang = newLocale;
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    return 'id';
  }
  return context.locale;
}

export function useSetLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    return () => {};
  }
  return context.setLocale;
}
