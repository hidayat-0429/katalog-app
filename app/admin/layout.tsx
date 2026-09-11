import { requireAdmin } from '@/lib/session'
import Link from 'next/link'
import { LayoutDashboard, Package, Tag, ClipboardList } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()

  return (
    <div className="grid md:grid-cols-[220px_1fr] gap-8 py-2">
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex flex-col gap-1 sticky top-20 h-fit">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-dark-muted px-3 mb-2">
          Panel Admin
        </h2>
        <Link href="/admin" className="sidebar-link">
          <LayoutDashboard className="w-4 h-4" />
          <span>Ringkasan</span>
        </Link>
        <Link href="/admin/produk" className="sidebar-link">
          <Package className="w-4 h-4" />
          <span>Produk</span>
        </Link>
        <Link href="/admin/kategori" className="sidebar-link">
          <Tag className="w-4 h-4" />
          <span>Kategori</span>
        </Link>
        <Link href="/admin/pesanan" className="sidebar-link">
          <ClipboardList className="w-4 h-4" />
          <span>Pesanan</span>
        </Link>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex gap-2 overflow-x-auto pb-2 border-b border-border dark:border-dark-border mb-4 text-xs">
        <Link href="/admin" className="nav-link">
          Ringkasan
        </Link>
        <Link href="/admin/produk" className="nav-link">
          Produk
        </Link>
        <Link href="/admin/kategori" className="nav-link">
          Kategori
        </Link>
        <Link href="/admin/pesanan" className="nav-link">
          Pesanan
        </Link>
      </div>

      {/* Main Content */}
      <div className="min-w-0">
        {children}
      </div>
    </div>
  )
}
