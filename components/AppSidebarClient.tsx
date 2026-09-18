"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function AppSidebarClient({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

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
      {/* Hamburger button — mobile only */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Buka menu"
        className="lg:hidden fixed top-4 left-4 z-40 w-9 h-9 flex items-center justify-center rounded-md bg-bg border border-border shadow-sm text-charcoal dark:text-stone-100 hover:bg-bg-subtle transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay — mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-xs"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar wrapper */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 w-[260px]
          bg-[#faf9f6] dark:bg-[#141715]
          border-r border-stone-200 dark:border-stone-800
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:z-40
        `}
      >
        {/* Close button — mobile */}
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Tutup menu"
          className="lg:hidden absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-md text-charcoal-muted hover:text-charcoal hover:bg-bg-subtle transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Sidebar content */}
        <div className="flex flex-col h-full overflow-y-auto">
          {children}
        </div>
      </aside>
    </>
  );
}
