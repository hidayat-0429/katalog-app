"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    if (locale === newLocale || !pathname) return;

    // Remove current locale from pathname if it exists
    let newPathname = pathname;
    if (pathname.startsWith(`/${locale}`)) {
      newPathname = pathname.slice(locale.length + 1) || "/";
    }

    // Add new locale to pathname
    const localizedPathname = `/${newLocale}${newPathname}`;
    router.push(localizedPathname);
  };

  return (
    <div className="flex gap-1">
      <Button
        onClick={() => handleLanguageChange("id")}
        variant={locale === "id" ? "primary" : "ghost"}
        size="sm"
        className="text-xs font-medium"
      >
        🇮🇩 ID
      </Button>
      <Button
        onClick={() => handleLanguageChange("en")}
        variant={locale === "en" ? "primary" : "ghost"}
        size="sm"
        className="text-xs font-medium"
      >
        🇬🇧 EN
      </Button>
    </div>
  );
}
