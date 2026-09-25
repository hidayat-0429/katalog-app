"use client";

import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/LocaleProvider";
import { useEffect, useState } from "react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (newLocale: 'id' | 'en') => {
    if (locale === newLocale) return;
    
    console.log('[LanguageSwitcher] Changing locale from', locale, 'to', newLocale);
    localStorage.setItem('locale', newLocale);
    window.dispatchEvent(new CustomEvent('localeChange', { detail: { locale: newLocale } }));
    console.log('[LanguageSwitcher] Event dispatched');
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
