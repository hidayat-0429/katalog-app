"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLocale, useSetLocale } from "@/components/LocaleProvider";
import { useTranslations } from "@/hooks/useTranslations";

export default function AppSidebarClient({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const setLocale = useSetLocale();
  const t = useTranslations();

  // Auto-close saat navigasi
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Tutup drawer jika resize ke desktop
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Lock scroll body saat drawer terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Top App Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-white/95 dark:bg-[#141715]/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsOpen(true)}
            aria-label={t.nav.openMenu}
            className="w-9 h-9 -ml-1 flex items-center justify-center rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0">
              <Image 
                src="/logos/etira-company-logo.png" 
                alt="Etira Logo" 
                width={28}
                height={28}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="font-heading font-bold text-xs text-neutral-900 dark:text-neutral-100 leading-none">
                ETIRA
              </p>
              <p className="text-[9px] text-neutral-500 dark:text-neutral-400 leading-none mt-0.5">
                Eka Timur Raya
              </p>
            </div>
          </Link>
        </div>
        <div className="flex items-center rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden" role="group" aria-label="Bahasa / Language">
          {(['id', 'en'] as const).map((code) => (
            <button
              key={code}
              onClick={() => setLocale(code)}
              aria-pressed={locale === code}
              className={`px-2.5 py-1 text-[11px] font-semibold uppercase transition-colors duration-150 ease-out ${
                locale === code
                  ? "bg-brand-forest-600 text-white"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
            >
              {code}
            </button>
          ))}
        </div>
      </header>

      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`
          fixed top-0 left-0 h-screen z-50 w-64
          bg-[#faf9f6] dark:bg-[#141715]
          border-r border-neutral-200 dark:border-neutral-800
          flex flex-col shadow-xl lg:shadow-none
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:z-40
        `}
      >
        <button
          onClick={() => setIsOpen(false)}
          aria-label={t.nav.closeMenu}
          className="lg:hidden absolute top-3.5 right-3.5 w-8 h-8 flex items-center justify-center rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
          {children}
        </div>
      </aside>
    </>
  );
}
