import Link from 'next/link';
import { ShoppingCart, ClipboardList, LayoutDashboard } from 'lucide-react';
import { getCurrentUser } from '@/lib/session';
import CartBadge from '@/components/CartBadge';
import MobileMenu from '@/components/MobileMenu';
import SignOutButton from '@/components/SignOutButton';
import ThemeToggle from '@/components/ThemeToggle';

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 bg-bg/95 dark:bg-dark-bg/95 backdrop-blur-sm border-b border-border dark:border-dark-border transition-colors duration-150">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Simple, Confident Brand Logo */}
          <Link href="/" className="flex flex-col">
            <span className="font-heading font-extrabold text-base sm:text-lg tracking-tight text-charcoal dark:text-dark-text leading-none">
              Etira Mushrooms
            </span>
            <span className="font-sans text-[10px] tracking-wider uppercase font-semibold text-primary dark:text-dark-primary mt-0.5">
              PT Eka Timur Raya
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/#katalog" className="nav-link">
              Katalog
            </Link>
            
            {user?.role === 'BUYER' && (
              <>
                <Link href="/keranjang" className="nav-link flex items-center gap-1.5 relative pr-2">
                  <ShoppingCart className="w-4 h-4" />
                  <span>Keranjang</span>
                  <CartBadge userId={user.id} />
                </Link>
                <Link href="/pesanan" className="nav-link flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4" />
                  <span>Pesanan</span>
                </Link>
              </>
            )}

            {user?.role === 'ADMIN' && (
              <Link href="/admin" className="nav-link flex items-center gap-1.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          {/* Right Actions: ThemeToggle + Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-charcoal-muted dark:text-dark-muted">
                    {user.name}
                  </span>
                  <SignOutButton />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login" className="btn-ghost text-xs">
                    Masuk
                  </Link>
                  <Link href="/register" className="btn-primary text-xs py-1.5 px-3">
                    Daftar
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
