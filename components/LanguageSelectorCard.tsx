"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LanguageSelectorCard() {
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
    window.location.reload();
  };

  if (!mounted) return null;

  return (
    <div className="w-full bg-gradient-to-r from-brand-forest-50 to-brand-forest-100 dark:from-brand-forest-950 dark:to-neutral-900 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          {/* Left: Logo & Branding */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-white dark:bg-neutral-800 flex items-center justify-center flex-shrink-0 shadow-md">
              <Image 
                src="/logos/etira-company-logo.png" 
                alt="Etira Mushrooms" 
                width={80}
                height={80}
                className="w-full h-full object-contain p-2"
              />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-forest-900 dark:text-white">
                Etira
              </h2>
              <p className="text-sm sm:text-base text-brand-forest-700 dark:text-brand-forest-300 font-medium">
                PT Eka Timur Raya
              </p>
              <p className="text-xs sm:text-sm text-brand-forest-600 dark:text-brand-forest-400 mt-0.5">
                Pasokan Jamur Premium
              </p>
            </div>
          </div>

          {/* Right: Language Selector */}
          <div className="flex flex-col items-center sm:items-end gap-3">
            <p className="text-sm font-semibold text-brand-forest-900 dark:text-white">
              Pilih Bahasa / Choose Language
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleChangeLanguage('id')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all transform hover:scale-105 ${
                  locale === 'id'
                    ? 'bg-brand-forest-600 text-white shadow-lg'
                    : 'bg-white dark:bg-neutral-800 text-brand-forest-700 dark:text-brand-forest-300 hover:bg-brand-forest-50 dark:hover:bg-neutral-700 shadow'
                }`}
              >
                🇮🇩 Bahasa Indonesia
              </button>
              <button
                onClick={() => handleChangeLanguage('en')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all transform hover:scale-105 ${
                  locale === 'en'
                    ? 'bg-brand-forest-600 text-white shadow-lg'
                    : 'bg-white dark:bg-neutral-800 text-brand-forest-700 dark:text-brand-forest-300 hover:bg-brand-forest-50 dark:hover:bg-neutral-700 shadow'
                }`}
              >
                🇬🇧 English
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
