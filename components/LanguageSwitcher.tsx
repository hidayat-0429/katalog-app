"use client";

import { useLocale } from "@/components/LocaleProvider";
import { useTranslations } from "@/hooks/useTranslations";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations();

  const handleChange = (newLocale: "id" | "en") => {
    if (locale === newLocale) return;
    localStorage.setItem("locale", newLocale);
    window.dispatchEvent(new CustomEvent("localeChange", { detail: { locale: newLocale } }));
  };

  return (
    <div
      className="flex items-center rounded-lg border border-neutral-200 dark:border-neutral-700"
      role="group"
      aria-label={t.nav.language}
    >
      {(["id", "en"] as const).map((code) => (
        <button
          key={code}
          onClick={() => handleChange(code)}
          aria-pressed={locale === code}
          className={`relative px-2.5 py-1 text-[11px] font-semibold uppercase transition-colors duration-150 ease-out first:rounded-l-md last:rounded-r-md after:absolute after:-inset-x-1 after:-inset-y-2.5 after:content-[''] ${
            locale === code
              ? "bg-brand-forest-600 text-white"
              : "text-charcoal-muted hover:text-neutral-900 dark:hover:text-neutral-100"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
