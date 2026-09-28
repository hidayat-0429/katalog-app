"use client";

import { useRef, useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, PanelLeftClose, PanelLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/hooks/useTranslations";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const COLLAPSE_STORAGE_KEY = "etira-nav-collapsed";

interface SidebarContextValue {
  isCollapsed: boolean;
  toggleCollapsed: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebarCollapse() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebarCollapse must be used within AppSidebarClient");
  return ctx;
}

export default function AppSidebarClient({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const t = useTranslations();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  // Auto-close saat navigasi
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Esc menutup drawer, sama seperti perilaku menu mobile pada umumnya
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // Fokus pindah ke drawer saat dibuka, lalu kembali ke tombol menu saat ditutup
  const wasOpen = useRef(false);
  useEffect(() => {
    if (isOpen) {
      panelRef.current?.focus();
    } else if (wasOpen.current) {
      triggerRef.current?.focus();
    }
    wasOpen.current = isOpen;
  }, [isOpen]);

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

  // Mode ciut rail desktop: preferensi disimpan, kelas di <html> yang mengubah --nav-w
  useEffect(() => {
    if (window.localStorage.getItem(COLLAPSE_STORAGE_KEY) === "1") setIsCollapsed(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("nav-collapsed", isCollapsed);
    window.localStorage.setItem(COLLAPSE_STORAGE_KEY, isCollapsed ? "1" : "0");
  }, [isCollapsed]);

  const toggleCollapsed = useCallback(() => setIsCollapsed((prev) => !prev), []);

  return (
    <>
      {/* Mobile Top App Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-white/95 dark:bg-surface/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            ref={triggerRef}
            onClick={() => setIsOpen(true)}
            aria-label={t.nav.openMenu}
            aria-expanded={isOpen}
            aria-controls="app-sidebar"
            className="relative w-9 h-9 -ml-1 flex items-center justify-center rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors after:absolute after:-inset-1 after:content-['']"
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
              <p className="text-[9px] text-charcoal-muted leading-none mt-0.5">
                Eka Timur Raya
              </p>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </header>

      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          aria-hidden="true"
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        id="app-sidebar"
        ref={panelRef}
        tabIndex={-1}
        role={isOpen ? "dialog" : "navigation"}
        aria-modal={isOpen ? true : undefined}
        aria-label={t.nav.menuTitle}
        className={`
          fixed top-0 left-0 h-dvh z-50 w-64 lg:w-[var(--nav-w)]
          bg-bg dark:bg-surface
          border-r border-neutral-200 dark:border-neutral-800
          flex flex-col shadow-xl lg:shadow-none
          transition-[transform,visibility,width] duration-300 ease-in-out
          outline-none
          ${isOpen ? "translate-x-0 visible" : "-translate-x-full invisible"}
          lg:translate-x-0 lg:visible lg:z-40
        `}
      >
        <button
          onClick={() => setIsOpen(false)}
          aria-label={t.nav.closeMenu}
          className="lg:hidden absolute top-3.5 right-3.5 w-8 h-8 flex items-center justify-center rounded-lg text-charcoal-muted hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors z-10 after:absolute after:-inset-1.5 after:content-['']"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col h-full overflow-y-auto no-scrollbar pb-[env(safe-area-inset-bottom)]">
          {/* Wordmark + tema/bahasa. Kelas nav-* diatur lewat html.nav-collapsed di globals.css */}
          <div className="nav-wordmark-row relative px-4 pr-12 lg:pr-4 pt-4 pb-3.5 lg:pb-2 border-b lg:border-b-0 border-neutral-200 dark:border-neutral-800 flex items-center gap-2 shrink-0">
            <Link href="/" className="nav-wordmark flex items-center gap-3 min-w-0 group">
              <div className="w-8 h-8 rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0">
                <Image
                  src="/logos/etira-company-logo.png"
                  alt="Etira Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="nav-label min-w-0">
                <p className="font-heading font-bold text-sm text-neutral-900 dark:text-neutral-100 leading-none">
                  ETIRA
                </p>
                <p className="text-[10px] text-charcoal-muted leading-none mt-0.5">
                  Eka Timur Raya
                </p>
              </div>
            </Link>
            <div className="hidden lg:flex items-center gap-1.5 ml-auto">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label={isCollapsed ? t.nav.expandMenu : t.nav.collapseMenu}
              aria-expanded={!isCollapsed}
              className="nav-collapse-toggle relative hidden lg:flex w-8 h-8 shrink-0 items-center justify-center rounded-lg text-charcoal-muted hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors after:absolute after:-inset-1 after:content-['']"
            >
              {isCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          </div>

          <SidebarContext.Provider value={{ isCollapsed, toggleCollapsed }}>
            {children}
          </SidebarContext.Provider>
        </div>
      </aside>
    </>
  );
}
