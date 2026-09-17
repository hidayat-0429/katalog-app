"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Tag, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Ringkasan", icon: LayoutDashboard, exact: true },
  { href: "/admin/produk", label: "Produk", icon: Package },
  { href: "/admin/kategori", label: "Kategori", icon: Tag },
  { href: "/admin/pesanan", label: "Pesanan", icon: ClipboardList },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex flex-col bg-primary rounded-lg overflow-hidden sticky top-20 h-fit min-h-[300px]">
        <div className="p-4 bg-primary-hover border-b border-white/10">
          <h2 className="text-xs font-sans font-semibold uppercase tracking-wider text-white/80">
            Panel Admin
          </h2>
        </div>
        <div className="flex flex-col p-2 gap-1">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact
              ? pathname === href
              : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "sidebar-link",
                  isActive && "sidebar-link-active"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex gap-2 overflow-x-auto pb-2 border-b border-border mb-4 font-sans text-sm">
        {navItems.map(({ href, label, exact }) => {
          const isActive = exact
            ? pathname === href
            : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "nav-link whitespace-nowrap",
                isActive && "nav-link-active"
              )}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </>
  );
}
