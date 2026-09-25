import Link from "next/link";
import Image from "next/image";
import { Home, Package, Info, Phone, ShoppingCart, ClipboardList, User, LayoutDashboard, LogIn, UserPlus, HelpCircle } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import CartBadge from "@/components/CartBadge";
import ThemeToggle from "@/components/ThemeToggle";
import SignOutButton from "@/components/SignOutButton";
import AppSidebarClient from "@/components/AppSidebarClient";
import NavLinkActive from "@/components/NavLinkActive";
import { Suspense } from "react";

export default async function AppSidebar() {
  const user = await getCurrentUser();

  return (
    <AppSidebarClient>
      {/* Wordmark - Compact */}
      <Link href="/" className="px-4 pr-12 lg:pr-4 pt-4 pb-3.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3 group">
        <div className="w-8 h-8 rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0">
          <Image 
            src="/logos/etira-company-logo.png" 
            alt="Etira Logo" 
            width={32}
            height={32}
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <p className="font-heading font-bold text-sm text-neutral-900 dark:text-neutral-100 leading-none">
            ETIRA
          </p>
          <p className="text-[10px] text-neutral-500 dark:text-neutral-500 leading-none mt-0.5">
            Pemesanan B2B
          </p>
        </div>
      </Link>

      {/* Nav Publik */}
      <nav className="px-3 pt-3 pb-2 flex flex-col gap-0.5">
        <p className="px-3 pb-1.5 text-xs font-bold tracking-widest uppercase text-neutral-400 dark:text-neutral-600">
          Menu
        </p>
        <NavLinkActive href="/" icon={<Home className="w-4 h-4" />} label="Beranda" />
        <NavLinkActive href="/?katalog=semua" icon={<Package className="w-4 h-4" />} label="Katalog" />
        <NavLinkActive href="/tentang" icon={<Info className="w-4 h-4" />} label="Tentang" />
        <NavLinkActive href="/kontak" icon={<Phone className="w-4 h-4" />} label="Kontak" />
        <NavLinkActive href="/faq" icon={<HelpCircle className="w-4 h-4" />} label="FAQ" />
      </nav>

      {/* Nav Admin */}
      {user?.role === "ADMIN" && (
        <nav className="px-3 pt-3 pb-2 flex flex-col gap-0.5 border-t border-neutral-100 dark:border-neutral-800/60 mt-1.5">
          <p className="px-3 pb-1.5 text-xs font-bold tracking-widest uppercase text-neutral-400 dark:text-neutral-600">
            Akses
          </p>
          <NavLinkActive
            href="/admin"
            icon={<LayoutDashboard className="w-4 h-4" />}
            label="Admin Portal"
            highlight
          />
        </nav>
      )}

      {/* Nav Mitra hanya BUYER */}
      {user?.role === "BUYER" && (
        <nav className="px-3 pt-3 pb-2 flex flex-col gap-0.5 border-t border-neutral-100 dark:border-neutral-800/60 mt-1.5">
          <p className="px-3 pb-1.5 text-xs font-bold tracking-widest uppercase text-neutral-400 dark:text-neutral-600">
            Pesanan
          </p>
          <NavLinkActive
            href="/keranjang"
            icon={<ShoppingCart className="w-4 h-4" />}
            label="Keranjang"
            badge={
              <Suspense fallback={null}>
                <CartBadge userId={user.id} />
              </Suspense>
            }
          />
          <NavLinkActive href="/pesanan" icon={<ClipboardList className="w-4 h-4" />} label="Pesanan" />
          <NavLinkActive href="/profil" icon={<User className="w-4 h-4" />} label="Profil" />
        </nav>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom section */}
      <div className="px-3 pb-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/60 flex flex-col gap-2.5">

        {/* User info - Compact */}
        {user && (
          <div className="px-3 py-2.5 bg-neutral-50 dark:bg-neutral-900/30 rounded-lg">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Akun Aktif</p>
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
              {user.name}
            </p>
          </div>
        )}

        {/* Theme + Auth - Compact */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-3">
            <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Mode Tampilan</span>
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-1.5">
            {user ? (
              <SignOutButton />
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded text-xs font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded text-xs font-semibold bg-brand-forest-600 hover:bg-brand-forest-700 text-white transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </AppSidebarClient>
  );
}
