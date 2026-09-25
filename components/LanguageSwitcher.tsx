"use client";

import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";

export default function LanguageSwitcher() {
  const [locale, setLocale] = useState<'id' | 'en'>('id');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Get locale from localStorage on mount
    const saved = localStorage.getItem('locale') as 'id' | 'en' | null;
    setLocale(saved || 'id');
    setMounted(true);
  }, []);

  const handleLanguageChange = (newLocale: 'id' | 'en') => {
    if (locale === newLocale) return;
    
    localStorage.setItem('locale', newLocale);
    setLocale(newLocale);
    
    // Trigger a refresh or emit event so other components can react
    window.dispatchEvent(new CustomEvent('localeChange', { detail: { locale: newLocale } }));
  };

  if (!mounted) return null;

  return (
    <div className="flex gap-1">
      <Button
        onClick={() => handleLanguageChange('id')}
        variant={locale === 'id' ? "primary" : "ghost"}
        size="sm"
        className="text-xs font-medium"
      >
        🇮🇩 ID
      </Button>
      <Button
        onClick={() => handleLanguageChange('en')}
        variant={locale === 'en' ? "primary" : "ghost"}
        size="sm"
        className="text-xs font-medium"
      >
        🇬🇧 EN
      </Button>
    </div>
  );
}
