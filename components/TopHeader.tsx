"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function TopHeader() {
  const [locale, setLocale] = useState<'id' | 'en'>('id');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('locale') as 'id' | 'en' | null;
    setLocale(saved || 'id');
    setMounted(true);
  }, []);

  const handleChangeLanguage = (newLocale: 'id' | 'en') => {
    localStorage.setItem('locale', newLocale);
    setLocale(newLocale);
    // Reload to apply changes
    window.location.reload();
  };

  if (!mounted) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#1a1a1a] border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo + Branding */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
            <Image 
              src="/logos/etira-company-logo.png" 
              alt="Etira" 
              width={32}
              height={32}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-neutral-900 dark:text-white">Etira</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Mushrooms</p>
          </div>
        </Link>

        {/* Language Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => handleChangeLanguage('id')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              locale === 'id'
                ? 'bg-brand-forest-600 text-white'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            🇮🇩 ID
          </button>
          <button
            onClick={() => handleChangeLanguage('en')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              locale === 'en'
                ? 'bg-brand-forest-600 text-white'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            🇬🇧 EN
          </button>
        </div>
      </div>
    </div>
  );
}
