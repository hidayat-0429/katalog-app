import Link from 'next/link';
import { ShoppingCart, ClipboardList, LayoutDashboard, UserPlus } from 'lucide-react';
import { getCurrentUser } from '@/lib/session';
import CartBadge from '@/components/CartBadge';
import MobileMenu from '@/components/MobileMenu';
import SignOutButton from '@/components/SignOutButton';
import ThemeToggle from '@/components/ThemeToggle';

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 bg-[#faf9f6]/95 dark:bg-[#161a18]/95 backdrop-blur-sm border-b border-stone-200/80 dark:border-stone-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Confident Corporate Wordmark */}
          <Link href="/" className="flex flex-col group">
            <span className="font-sans font-bold text-base sm:text-lg tracking-tight text-[#1f2421] dark:text-stone-100 leading-none">
              ETIRA MUSHROOMS
            </span>
            <span className="font-sans text-[10px] tracking-wider uppercase font-medium text-stone-500 dark:text-stone-400 mt-1">
              PT Eka Timur Raya
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/?katalog=semua" className="text-sm font-medium text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white transition-colors">
              Katalog
            </Link>
            <Link href="/tentang" className="text-sm font-medium text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white transition-colors">
              Tentang Kami
            </Link>
            <Link href="/kontak" className="text-sm font-medium text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white transition-colors">
              Kontak
            </Link>
            
            {user?.role === 'BUYER' && (
              <>
                <Link href="/profil" className="text-sm font-medium text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white transition-colors flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4 text-stone-400" />
                  <span>Profil</span>
                </Link>
                <Link href="/keranjang" className="text-sm font-medium text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white transition-colors flex items-center gap-1.5 relative pr-2">
                  <ShoppingCart className="w-4 h-4 text-stone-400" />
                  <span>Keranjang</span>
                  <CartBadge userId={user.id} />
                </Link>
                <Link href="/pesanan" className="text-sm font-medium text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white transition-colors flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4 text-stone-400" />
                  <span>Pesanan</span>
                </Link>
              </>
            )}

            {user?.role === 'ADMIN' && (
              <Link href="/admin" className="text-xs font-semibold text-[#1b382b] dark:text-emerald-300 bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-md border border-stone-200 dark:border-stone-700 flex items-center gap-1.5">
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Portal Admin</span>
              </Link>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                    {user.name}
                  </span>
                  <SignOutButton />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login" className="px-3.5 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 rounded-md hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800 transition-colors">
                    Masuk
                  </Link>
                  <Link href="/register" className="bg-[#1b382b] hover:bg-[#163024] text-white text-xs font-medium py-2 px-4 rounded-md transition-colors shadow-xs">
                    Daftar Mitra
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <MobileMenu user={user} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
