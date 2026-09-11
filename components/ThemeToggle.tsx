"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded border border-border dark:border-dark-border bg-white dark:bg-dark-surface" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-8 h-8 rounded border border-border dark:border-dark-border bg-white dark:bg-dark-surface text-charcoal dark:text-dark-text hover:bg-bg-subtle dark:hover:bg-dark-surface/80 flex items-center justify-center transition-colors duration-150"
      title={isDark ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-300" />
      ) : (
        <Moon className="w-4 h-4 text-charcoal" />
      )}
    </button>
  );
}
