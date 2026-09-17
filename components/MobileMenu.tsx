"use client";

import { useState } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Menu, X, Store, ShoppingCart, ClipboardList, LayoutDashboard, LogIn, UserPlus, LogOut, Info, Phone } from 'lucide-react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'BUYER';
};

export default function MobileMenu({ user }: { user?: User }) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="btn-icon"
        aria-label="Buka menu"
      >
        <Menu className="w-5 h-5 text-charcoal dark:text-dark-text" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={closeMenu}
          />
          
          {/* Panel */}
          <div className="relative w-64 h-full bg-white dark:bg-dark-bg border-l border-border dark:border-dark-border shadow-md flex flex-col animate-slide-in-right text-charcoal dark:text-dark-text">
            <div className="flex items-center justify-between p-4 border-b border-border dark:border-dark-border">
              <span className="font-bold text-sm text-charcoal dark:text-dark-text">Menu</span>
              <button 
                onClick={closeMenu} 
                className="btn-icon w-8 h-8"
              >
                <X className="w-4 h-4 text-charcoal dark:text-dark-text" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-3">
              {user && (
                <div className="px-4 pb-3 mb-3 border-b border-border dark:border-dark-border">
                  <p className="text-xs text-charcoal-muted dark:text-dark-muted">Masuk sebagai</p>
                  <p className="font-semibold text-sm truncate mt-0.5">{user.name}</p>
                  <span className="inline-block mt-1 text-[11px] font-medium text-sage dark:text-dark-sage">
                    Akun {user.role === 'ADMIN' ? 'Admin' : 'Pembeli'}
                  </span>
                </div>
              )}

              <nav className="flex flex-col gap-1 px-2 text-sm">
                <Link 
                  href="/#katalog" 
                  onClick={closeMenu} 
                  className="flex items-center gap-2.5 px-3 py-2 rounded hover:bg-bg-subtle dark:hover:bg-dark-surface font-medium transition-colors"
                >
                  <Store className="w-4 h-4 text-charcoal-muted dark:text-dark-muted" /> Katalog Produk
                </Link>
                <Link 
                  href="/tentang" 
                  onClick={closeMenu} 
                  className="flex items-center gap-2.5 px-3 py-2 rounded hover:bg-bg-subtle dark:hover:bg-dark-surface font-medium transition-colors"
                >
                  <Info className="w-4 h-4 text-charcoal-muted dark:text-dark-muted" /> Tentang Perusahaan
                </Link>
                <Link 
                  href="/kontak" 
                  onClick={closeMenu} 
                  className="flex items-center gap-2.5 px-3 py-2 rounded hover:bg-bg-subtle dark:hover:bg-dark-surface font-medium transition-colors"
                >
                  <Phone className="w-4 h-4 text-charcoal-muted dark:text-dark-muted" /> Hubungi Kami
                </Link>

                {user?.role === 'BUYER' && (
                  <>
                    <Link 
                      href="/profil" 
                      onClick={closeMenu} 
                      className="flex items-center gap-2.5 px-3 py-2 rounded hover:bg-bg-subtle dark:hover:bg-dark-surface font-medium transition-colors"
                    >
                      <UserPlus className="w-4 h-4 text-charcoal-muted dark:text-dark-muted" /> Profil & Alamat
                    </Link>
                    <Link 
                      href="/keranjang" 
                      onClick={closeMenu} 
                      className="flex items-center justify-between px-3 py-2 rounded hover:bg-bg-subtle dark:hover:bg-dark-surface font-medium transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <ShoppingCart className="w-4 h-4 text-charcoal-muted dark:text-dark-muted" /> Keranjang
                      </div>
                    </Link>
                    <Link 
                      href="/pesanan" 
                      onClick={closeMenu} 
                      className="flex items-center gap-2.5 px-3 py-2 rounded hover:bg-bg-subtle dark:hover:bg-dark-surface font-medium transition-colors"
                    >
                      <ClipboardList className="w-4 h-4 text-charcoal-muted dark:text-dark-muted" /> Pesanan Saya
                    </Link>
                  </>
                )}

                {user?.role === 'ADMIN' && (
                  <Link 
                    href="/admin" 
                    onClick={closeMenu} 
                    className="flex items-center gap-2.5 px-3 py-2 rounded hover:bg-bg-subtle dark:hover:bg-dark-surface font-medium transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-charcoal-muted dark:text-dark-muted" /> Dashboard Admin
                  </Link>
                )}
              </nav>
            </div>

            <div className="p-4 border-t border-border dark:border-dark-border">
              {user ? (
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full flex items-center gap-2 justify-center py-2 text-xs font-semibold text-[#B91C1C] dark:text-[#F87171] hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Keluar
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link 
                    href="/login" 
                    onClick={closeMenu} 
                    className="btn-secondary text-xs text-center py-2"
                  >
                    <LogIn className="w-3.5 h-3.5 inline mr-1" /> Masuk
                  </Link>
                  <Link 
                    href="/register" 
                    onClick={closeMenu} 
                    className="btn-primary text-xs text-center py-2"
                  >
                    <UserPlus className="w-3.5 h-3.5 inline mr-1" /> Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
