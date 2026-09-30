"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import idMessages from '@/messages/id.json';
import enMessages from '@/messages/en.json';

type Locale = 'id' | 'en';

// Server action tidak bisa membaca localStorage, jadi mirror locale ke cookie
// supaya pesan validasi ikut bahasa pengunjung.
function writeLocaleCookie(value: Locale) {
  document.cookie = `locale=${value}; path=/; max-age=31536000; samesite=lax`;
}

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Get locale from localStorage on mount; pengunjung baru ikut default Inggris situs
    const saved = (localStorage.getItem('locale') as Locale) || 'en';
    setLocaleState(saved);
    writeLocaleCookie(saved);

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
      writeLocaleCookie(newLocale);
    };

    window.addEventListener('localeChange', handleLocaleChange);
    return () => window.removeEventListener('localeChange', handleLocaleChange);
  }, []);

  // Untuk route yang dirakit saat pengunjung datang, Next menulis <meta> hasil metadata di ujung
  // <body>. Audit Lighthouse membaca <head>, jadi tag-nya dinaikkan setelah hydration. Tag bisa
  // menyusul (mis. /produk/[id] yang metadata-nya baru siap belakangan), jadi pakai observer.
  // HTML mentah tidak berubah — lihat catatan proyek soal rute statis.
  useEffect(() => {
    const penanda = (el: Element) =>
      `meta[${el.getAttribute('name') ? 'name' : 'property'}="${el.getAttribute('name') ?? el.getAttribute('property')}"]`;
    const hoist = () => {
      document.body
        .querySelectorAll('meta[name="description"], meta[name="keywords"], meta[property^="og:"], meta[name^="twitter:"]')
        .forEach((el) => {
          // Ganti versi lama di head, kalau tidak deskripsi menumpuk tiap pindah route.
          document.head.querySelector(penanda(el))?.remove();
          document.head.appendChild(el);
        });
    };
    hoist();
    const observer = new MutationObserver(hoist);
    observer.observe(document.body, { childList: true });
    return () => observer.disconnect();
  }, [pathname]);

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

    const apply = () => {
      if (document.title !== title) document.title = title;
    };
    apply();

    // React adopsi <title> server setelah effect ini jalan (tertunda di tab background), jadi
    // jaga judul kita lewat observer alih-alih menebak jeda waktu.
    const titleEl = document.querySelector('title');
    if (!titleEl) return;
    const observer = new MutationObserver(apply);
    observer.observe(titleEl, { childList: true, characterData: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname, locale, mounted]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    writeLocaleCookie(newLocale);
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
    return 'en';
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
