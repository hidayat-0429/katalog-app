"use client";

import Link from "next/link";
import { Home, Package, Info, Phone, ShoppingCart, ClipboardList, User, LayoutDashboard, LogIn, UserPlus, HelpCircle } from "lucide-react";
import CartBadge from "@/components/CartBadge";
import ThemeToggle from "@/components/ThemeToggle";
import SignOutButton from "@/components/SignOutButton";
import NavLinkActive from "@/components/NavLinkActive";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLocale } from "@/components/LocaleProvider";
import idMessages from "@/messages/id.json";
import enMessages from "@/messages/en.json";

export interface AppSidebarContentProps {
  user: any;
  cartCount?: number;
}

export default function AppSidebarContent({ user, cartCount = 0 }: AppSidebarContentProps) {
  const locale = useLocale();
  const messages = locale === 'en' ? enMessages : idMessages;
  const nav = messages.nav;

  return (
    <>
      {/* Nav Publik */}
      <nav className="px-3 pt-3 pb-2 flex flex-col gap-0.5">
        <p className="px-3 pb-1.5 text-xs font-bold tracking-widest uppercase text-neutral-400 dark:text-neutral-600">
          {locale === 'en' ? 'MENU' : 'MENU'}
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
          <p className="px-3 pb-1.5 text-xs font-bold tracking-widest uppercase text-neutral-400 dark:text-neutral-600">
            {locale === 'en' ? 'ACCESS' : 'AKSES'}
          </p>
          <NavLinkActive
            href="/admin"
            icon={<LayoutDashboard className="w-4 h-4" />}
            label={locale === 'en' ? 'Admin Portal' : 'Admin Portal'}
            highlight
          />
        </nav>
      )}

      {/* Nav Mitra hanya BUYER */}
      {user?.role === "BUYER" && (
        <nav className="px-3 pt-3 pb-2 flex flex-col gap-0.5 border-t border-neutral-100 dark:border-neutral-800/60 mt-1.5">
          <p className="px-3 pb-1.5 text-xs font-bold tracking-widest uppercase text-neutral-400 dark:text-neutral-600">
            {locale === 'en' ? 'ORDERS' : 'PESANAN'}
          </p>
          <NavLinkActive
            href="/keranjang"
            icon={<ShoppingCart className="w-4 h-4" />}
            label={nav.cart}
            badge={<CartBadge count={cartCount} />}
          />
          <NavLinkActive href="/pesanan" icon={<ClipboardList className="w-4 h-4" />} label={nav.orders} />
          <NavLinkActive href="/profil" icon={<User className="w-4 h-4" />} label={nav.profile} />
        </nav>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom section */}
      <div className="px-3 pb-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/60 flex flex-col gap-2.5">

        {/* User info - Compact */}
        {user && (
          <div className="px-3 py-2.5 bg-neutral-50 dark:bg-neutral-900/30 rounded-lg">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {locale === 'en' ? 'Active Account' : 'Akun Aktif'}
            </p>
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
              {user.name}
            </p>
          </div>
        )}

        {/* Theme + Language + Auth - Compact */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-3">
            <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
              {locale === 'en' ? 'Display Mode' : 'Mode Tampilan'}
            </span>
            <ThemeToggle />
          </div>
          <div className="px-3">
            <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">
              {locale === 'en' ? 'Language' : 'Bahasa'}
            </p>
            <LanguageSwitcher />
          </div>
          <div className="flex items-center gap-1.5">
            {user ? (
              <SignOutButton label={nav.logout} />
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded text-xs font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  {nav.login}
                </Link>
                <Link
                  href="/register"
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded text-xs font-semibold bg-brand-forest-600 hover:bg-brand-forest-700 text-white transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  {nav.register}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
