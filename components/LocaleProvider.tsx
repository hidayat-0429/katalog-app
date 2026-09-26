"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import idMessages from '@/messages/id.json';
import enMessages from '@/messages/en.json';

type Locale = 'id' | 'en';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('id');
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

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

  // Sinkronkan judul tab browser dengan locale aktif (route tanpa map, mis. /produk/[id], pakai judul server)
  useEffect(() => {
    if (!mounted || !pathname) return;
    const m = (locale === 'en' ? enMessages : idMessages).metadata;
    const titleMap: Record<string, string> = {
      '/': m.default,
      '/tentang': m.about,
      '/kontak': m.contact,
      '/faq': m.faq,
      '/profil': m.profile,
      '/pesanan': m.orders,
      '/keranjang': m.cart,
      '/login': m.login,
      '/register': m.register,
    };
    const title = titleMap[pathname];
    if (!title) return;
    document.title = title;
    // Adopsi <title> server oleh React saat hydration menimpa judul yang baru dipasang; pasang ulang setelahnya
    const timers = [150, 500].map((ms) =>
      setTimeout(() => {
        document.title = title;
      }, ms)
    );
    return () => timers.forEach(clearTimeout);
  }, [pathname, locale, mounted]);

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
