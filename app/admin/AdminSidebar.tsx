"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Tag, ClipboardList, Mail, Users, ArrowLeft, PanelLeftClose, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";
import SignOutButton from "@/components/SignOutButton";
import NotificationToggle from "./NotificationToggle";
import { useAdminInbox } from "./AdminInboxProvider";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  badge?: "pending" | "unread";
};

const navItems: NavItem[] = [
  { href: "/admin", label: "Ringkasan", icon: LayoutDashboard, exact: true },
  { href: "/admin/produk", label: "Produk", icon: Package },
  { href: "/admin/kategori", label: "Kategori", icon: Tag },
  { href: "/admin/pesanan", label: "Pesanan", icon: ClipboardList, badge: "pending" },
  { href: "/admin/pesan", label: "Pesan Masuk", icon: Mail, badge: "unread" },
  { href: "/admin/pengguna", label: "Pengguna", icon: Users },
];

interface AdminSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

// "/admin/pesan" must not light up while visiting "/admin/pesanan"
function isActivePath(pathname: string | null, href: string, exact?: boolean) {
  if (!pathname) return false;
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

const NAV_BADGE_META = {
  pending: {
    // DEFAULT + teks putih cuma 2.2:1; varian 700 naik ke 5.0:1 tanpa keluar dari palet status.
    tone: "bg-semantic-warning-700 text-white",
    description: "pesanan perlu diproses",
  },
  unread: {
    tone: "bg-semantic-info-700 text-white",
    description: "pesan belum dibaca",
  },
} as const;

function useNavBadge(kind: "pending" | "unread") {
  const { pendingOrders, unreadMessages } = useAdminInbox();
  const count = kind === "pending" ? pendingOrders : unreadMessages;
  return { count, ...NAV_BADGE_META[kind] };
}

function NavBadge({
  kind,
  collapsed,
}: {
  kind: "pending" | "unread";
  collapsed: boolean;
}) {
  const { count, tone, description } = useNavBadge(kind);
  if (count <= 0) return null;

  if (collapsed) {
    return (
      <span
        className={cn(
          "absolute right-1.5 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full ring-2 ring-neutral-50 dark:ring-surface",
          tone
        )}
        title={`${count} ${description}`}
      />
    );
  }

  return (
    <span
      className={cn(
        "ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold tabular-nums",
        tone
      )}
      title={`${count} ${description}`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

function MobileNavBadge({ kind }: { kind: "pending" | "unread" }) {
  const { count, tone, description } = useNavBadge(kind);
  if (count <= 0) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold tabular-nums",
        tone
      )}
      title={`${count} ${description}`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}


export default function AdminSidebar({ isCollapsed = false, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  return (
    <>
      {/* Desktop: vertical nav with surface differentiation */}
      <div className="hidden lg:flex flex-col h-full bg-neutral-50 dark:bg-surface">
        {/* Logo Section */}
        <div className={cn("py-6 shrink-0 flex items-center transition-all overflow-hidden", isCollapsed ? "px-0 justify-center flex-col gap-4" : "px-5 gap-3")}>
          <div className="w-8 h-8 rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0">
            <Image 
              src="/logos/etira-company-logo.png" 
              alt="Etira Logo" 
              width={32}
              height={32}
              className="w-full h-full object-contain"
            />
          </div>
          {!isCollapsed && (
            <div>
              <p className="font-heading font-bold text-sm text-neutral-900 dark:text-neutral-100 leading-none">
                ETIRA
              </p>
              <p className="text-[10px] text-charcoal-muted leading-none mt-0.5">
                Admin Panel
              </p>
            </div>
          )}
          {onToggle && isCollapsed && (
            <button onClick={onToggle} aria-label="Bentangkan Menu" className="p-1.5 text-charcoal-muted hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">
              <PanelLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto no-scrollbar overflow-x-hidden">
          {!isCollapsed ? (
            <div className="flex items-center justify-between px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-charcoal-muted">
                Menu
              </p>
              {onToggle && (
                <button onClick={onToggle} aria-label="Ciutkan Menu" className="text-charcoal-muted hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors" title="Ciutkan Menu">
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="h-4" /> // spacing
          )}
          
          {navItems.map(({ href, label, icon: Icon, exact, badge }) => {
            const isActive = isActivePath(pathname, href, exact);
            return (
              <Link
                key={href}
                href={href}
                title={isCollapsed ? label : undefined}
                aria-label={isCollapsed ? label : undefined}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 py-3 min-h-[44px] rounded-lg text-sm font-medium transition-colors duration-150 ease-out relative group",
                  isCollapsed ? "px-0 justify-center" : "px-3",
                  isActive
                    ? "bg-brand-forest-100 dark:bg-brand-forest-900/50 text-brand-forest-700 dark:text-brand-forest-300 font-semibold"
                    : "text-charcoal-muted hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand-forest-600 dark:bg-brand-forest-500 rounded-r-full" />
                )}
                <Icon className={cn("w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-105", isActive && "text-brand-forest-600 dark:text-brand-forest-500")} />
                {!isCollapsed && <span className="truncate">{label}</span>}
                {badge && <NavBadge kind={badge} collapsed={isCollapsed} />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className={cn("p-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col gap-3 shrink-0", isCollapsed ? "items-center px-2" : "px-4")}>
          <NotificationToggle iconOnly={isCollapsed} />
          {!isCollapsed && (
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-semibold text-charcoal-muted">Mode Tampilan</span>
              <ThemeToggle />
            </div>
          )}
          {isCollapsed && <ThemeToggle />}
          
          <div title={isCollapsed ? "Keluar" : undefined}>
            <SignOutButton iconOnly={isCollapsed} />
          </div>

          <Link
            href="/"
            title={isCollapsed ? "Ke Beranda Utama" : undefined}
            aria-label={isCollapsed ? "Ke Beranda Utama" : undefined}
            className={cn(
              "flex items-center justify-center gap-1.5 py-2 min-h-[40px] rounded-lg text-xs font-medium text-charcoal-muted hover:text-neutral-900 dark:hover:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors",
              isCollapsed ? "px-0 w-10 h-10" : "px-3"
            )}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {!isCollapsed && "Ke Beranda Utama"}
          </Link>
        </div>
      </div>

      {/* Mobile: Header + horizontal scroll nav */}
      <div className="lg:hidden flex flex-col bg-surface">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
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
              <p className="text-[10px] text-charcoal-muted leading-none mt-0.5">
                Admin Panel
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NotificationToggle iconOnly />
            <ThemeToggle />
            <Link
              href="/"
              className="p-2 text-charcoal-muted hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              title="Ke Beranda"
              aria-label="Ke Beranda"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Mobile Nav */}
        <nav className="flex gap-1 overflow-x-auto px-3 py-2 bg-neutral-50 dark:bg-neutral-800/50 no-scrollbar">
          {navItems.map(({ href, label, exact, badge }) => {
            const isActive = isActivePath(pathname, href, exact);
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 min-h-[44px] rounded-lg text-sm font-semibold whitespace-nowrap transition-colors duration-150 ease-out",
                  isActive
                    ? "bg-brand-forest-600 dark:bg-brand-forest-500 text-white"
                    : "text-charcoal-muted hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-white dark:hover:bg-neutral-700/50"
                )}
              >
                {label}
                {badge && <MobileNavBadge kind={badge} />}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
