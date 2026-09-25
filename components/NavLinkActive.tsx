"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface NavLinkActiveProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: React.ReactNode;
  highlight?: boolean;
}

export default function NavLinkActive({ href, icon, label, badge, highlight }: NavLinkActiveProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isActive = (() => {
    if (!pathname) return false;

    // Mode Katalog (/?katalog=semua atau URL ber-parameter katalog)
    if (href.includes("katalog=")) {
      return pathname === "/" && Boolean(searchParams?.get("katalog"));
    }

    // Beranda murni: hanya aktif jika pathname "/" DAN bukan sedang mode katalog
    if (href === "/") {
      return pathname === "/" && !searchParams?.get("katalog");
    }

    // Halaman lainnya (misal /tentang, /kontak, /admin, /keranjang, /pesanan, /profil)
    const basePath = href.split("?")[0];
    if (basePath === "/") return false;
    return pathname.startsWith(basePath);
  })();

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-sans text-sm transition-colors duration-150 relative ${
        highlight
          ? isActive
            ? "text-brand-forest-700 dark:text-brand-forest-300 bg-brand-forest-100/70 dark:bg-brand-forest-900/40 font-semibold"
            : "text-brand-forest-700 dark:text-brand-forest-400 hover:bg-brand-forest-50 dark:hover:bg-brand-forest-900/30 font-medium"
          : isActive
            ? "bg-brand-forest-100 dark:bg-brand-forest-900/50 text-brand-forest-700 dark:text-brand-forest-300 font-semibold"
            : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium"
      }`}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand-forest-600 dark:bg-brand-forest-500 rounded-r-full" />
      )}
      <span className="shrink-0">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge && <span className="relative shrink-0">{badge}</span>}
    </Link>
  );
}
