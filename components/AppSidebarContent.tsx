"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { Home, Package, Info, Phone, ShoppingCart, ClipboardList, User, LayoutDashboard, LogIn, UserPlus, HelpCircle } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import SignOutButton from "@/components/SignOutButton";
import NavLinkActive from "@/components/NavLinkActive";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLocale } from "@/components/LocaleProvider";
import idMessages from "@/messages/id.json";
import enMessages from "@/messages/en.json";

export interface AppSidebarContentProps {
  user: any;
  cartBadge?: ReactNode;
}

export default function AppSidebarContent({ user, cartBadge }: AppSidebarContentProps) {
  const locale = useLocale();
  const nav = (locale === "en" ? enMessages : idMessages).nav;

  return (
    <>
      {/* Nav Publik */}
      <nav className="px-3 pt-3 pb-2 flex flex-col gap-0.5">
        <p className="nav-hide-collapsed px-3 pb-1.5 text-xs font-bold tracking-widest uppercase text-charcoal-muted">
          {nav.sectionMenu}
        </p>
        <NavLinkActive href="/" icon={<Home className="w-4 h-4" />} label={nav.home} />
        <NavLinkActive href="/?katalog=semua" icon={<Package className="w-4 h-4" />} label={nav.catalog} />
        <NavLinkActive href="/tentang" icon={<Info className="w-4 h-4" />} label={nav.about} />
        <NavLinkActive href="/kontak" icon={<Phone className="w-4 h-4" />} label={nav.contact} />
        <NavLinkActive href="/faq" icon={<HelpCircle className="w-4 h-4" />} label={nav.faq} />
      </nav>

      {/* Nav Admin */}
      {user?.role === "ADMIN" && (
        <nav className="px-3 pt-3 pb-2 flex flex-col gap-0.5 border-t border-neutral-100 dark:border-neutral-800/60 mt-1.5">
          <p className="nav-hide-collapsed px-3 pb-1.5 text-xs font-bold tracking-widest uppercase text-charcoal-muted">
            {nav.sectionAccess}
          </p>
          <NavLinkActive
            href="/admin"
            icon={<LayoutDashboard className="w-4 h-4" />}
            label={nav.adminPortal}
            highlight
          />
        </nav>
      )}

      {/* Nav Mitra hanya BUYER */}
      {user?.role === "BUYER" && (
        <nav className="px-3 pt-3 pb-2 flex flex-col gap-0.5 border-t border-neutral-100 dark:border-neutral-800/60 mt-1.5">
          <p className="nav-hide-collapsed px-3 pb-1.5 text-xs font-bold tracking-widest uppercase text-charcoal-muted">
            {nav.sectionBuyer}
          </p>
          <NavLinkActive
            href="/keranjang"
            icon={<ShoppingCart className="w-4 h-4" />}
            label={nav.cart}
            badge={cartBadge}
          />
          <NavLinkActive href="/pesanan" icon={<ClipboardList className="w-4 h-4" />} label={nav.orders} />
          <NavLinkActive href="/profil" icon={<User className="w-4 h-4" />} label={nav.profile} />
        </nav>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom section: akun + aksi akun di atas, preferensi di dasar */}
      <div className="px-3 pb-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/60 flex flex-col gap-2.5">

        {/* User info - Compact */}
        {user && (
          <div className="nav-hide-collapsed px-3 py-2.5 bg-neutral-50 dark:bg-neutral-900/30 rounded-lg">
            <p className="text-xs text-charcoal-muted">
              {nav.activeAccount}
            </p>
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
              {user.name}
            </p>
          </div>
        )}

        {/* Auth dulu: kalau paling bawah, Logout kalah oleh tinggi kolom dan butuh scroll */}
        <div className="space-y-2">
          <div className="nav-auth flex items-center gap-1.5">
            {user ? (
              <SignOutButton label={nav.logout} />
            ) : (
              <>
                <Link
                  href="/login"
                  className="nav-auth-btn relative flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded text-xs font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-neutral-100 dark:hover:bg-neutral-800 transition-colors after:absolute after:-inset-y-1.5 after:inset-x-0 after:content-['']"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="nav-label">{nav.login}</span>
                </Link>
                <Link
                  href="/register"
                  className="nav-auth-btn relative flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded text-xs font-semibold bg-brand-forest-600 hover:bg-brand-forest-700 text-white transition-colors after:absolute after:-inset-y-1.5 after:inset-x-0 after:content-['']"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="nav-label">{nav.register}</span>
                </Link>
              </>
            )}
          </div>

          {/* Satu baris untuk dua preferensi: dua label teks makan ±60px padahal ikonnya
              sudah jelas. Pemilih bahasa tetap desktop-only, bar atas mobile sudah punya. */}
          <div className="nav-center-row flex items-center justify-center gap-2 lg:justify-between px-3">
            <ThemeToggle />
            <div className="nav-hide-collapsed hidden lg:flex" role="group" aria-label={nav.language}>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
