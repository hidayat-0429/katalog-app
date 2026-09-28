"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations();
  // Hindari hydration mismatch: render setelah mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-md bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-9 h-9 flex items-center justify-center rounded-md text-charcoal-muted hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 transition-colors after:absolute after:-inset-1 after:content-['']"
      aria-label={isDark ? t.common.lightMode : t.common.darkMode}
    >
      {isDark ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
