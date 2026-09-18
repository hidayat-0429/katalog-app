import Link from "next/link";
import { Home, Package, Info, Phone, ShoppingCart, ClipboardList, User, LayoutDashboard, LogIn, UserPlus } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import CartBadge from "@/components/CartBadge";
import ThemeToggle from "@/components/ThemeToggle";
import SignOutButton from "@/components/SignOutButton";
import AppSidebarClient from "@/components/AppSidebarClient";

export default async function AppSidebar() {
  const user = await getCurrentUser();

  return (
    <AppSidebarClient>
      {/* Wordmark */}
      <div className="px-6 pt-6 pb-5 border-b border-stone-200 dark:border-stone-800">
        <Link href="/" className="group block">
          <span className="font-heading font-bold text-[15px] tracking-tight text-[#1f2421] dark:text-stone-100 leading-none block">
            ETIRA MUSHROOMS
          </span>
          <span className="font-sans text-[10px] tracking-widest uppercase font-medium text-stone-400 dark:text-stone-500 mt-1 block">
            PT Eka Timur Raya
          </span>
        </Link>
      </div>

      {/* Nav Publik */}
      <nav className="px-3 pt-5 pb-2 flex flex-col gap-0.5">
        <p className="px-3 pb-2 text-[10px] font-semibold tracking-widest uppercase text-stone-400 dark:text-stone-600">
          Navigasi
        </p>
        <NavLink href="/" icon={<Home className="w-4 h-4" />} label="Beranda" />
        <NavLink href="/?katalog=semua" icon={<Package className="w-4 h-4" />} label="Katalog Produk" />
        <NavLink href="/tentang" icon={<Info className="w-4 h-4" />} label="Tentang Kami" />
        <NavLink href="/kontak" icon={<Phone className="w-4 h-4" />} label="Kontak" />
      </nav>

      {/* Nav Mitra — hanya BUYER */}
      {user?.role === "BUYER" && (
        <nav className="px-3 pt-4 pb-2 flex flex-col gap-0.5 border-t border-stone-100 dark:border-stone-800/60 mt-2">
          <p className="px-3 pb-2 text-[10px] font-semibold tracking-widest uppercase text-stone-400 dark:text-stone-600">
            Akun Saya
          </p>
          <NavLink
            href="/keranjang"
            icon={<ShoppingCart className="w-4 h-4" />}
            label="Keranjang"
            badge={<CartBadge userId={user.id} />}
          />
          <NavLink href="/pesanan" icon={<ClipboardList className="w-4 h-4" />} label="Pesanan Saya" />
          <NavLink href="/profil" icon={<User className="w-4 h-4" />} label="Profil & Alamat" />
        </nav>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom section */}
      <div className="px-3 pb-5 pt-4 border-t border-stone-100 dark:border-stone-800/60 flex flex-col gap-1">

        {/* User info */}
        {user && (
          <div className="px-3 py-2 mb-1">
            <p className="text-[11px] text-stone-400 dark:text-stone-500">Masuk sebagai</p>
            <p className="text-xs font-semibold text-charcoal dark:text-stone-200 truncate mt-0.5">{user.name}</p>
          </div>
        )}

        {/* Admin portal */}
        {user?.role === "ADMIN" && (
          <NavLink
            href="/admin"
            icon={<LayoutDashboard className="w-4 h-4" />}
            label="Portal Admin"
            highlight
          />
        )}

        {/* Theme + Auth */}
        <div className="flex items-center justify-between px-3 pt-2">
          <ThemeToggle />
          <div className="flex items-center gap-1">
            {user ? (
              <SignOutButton />
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium text-charcoal-muted hover:text-charcoal hover:bg-bg-subtle dark:hover:bg-stone-800 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="px-2.5 py-1.5 rounded text-xs font-medium bg-primary text-white hover:bg-primary-hover transition-colors flex items-center gap-1.5"
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

// ─── Reusable NavLink ──────────────────────────────────────────────────────
function NavLink({
  href,
  icon,
  label,
  badge,
  highlight,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-md font-sans text-sm font-medium transition-colors relative ${
        highlight
          ? "text-[#1b382b] dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
          : "text-charcoal-muted dark:text-stone-400 hover:text-charcoal dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800"
      }`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge && <span className="relative shrink-0">{badge}</span>}
    </Link>
  );
}
