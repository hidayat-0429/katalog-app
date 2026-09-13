import { requireAdmin } from '@/lib/session'
import Link from 'next/link'
import { LayoutDashboard, Package, Tag, ClipboardList } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()

  return (
    <div className="grid md:grid-cols-[240px_1fr] gap-8 py-2">
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex flex-col bg-primary rounded-lg overflow-hidden sticky top-20 h-fit min-h-[300px]">
        <div className="p-4 bg-primary-hover border-b border-white/10">
          <h2 className="text-xs font-sans font-semibold uppercase tracking-wider text-white/80">
            Panel Admin
          </h2>
        </div>
        <div className="flex flex-col p-2 gap-1">
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
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex gap-2 overflow-x-auto pb-2 border-b border-border mb-4 font-sans text-sm">
        <Link href="/admin" className="nav-link whitespace-nowrap">
          Ringkasan
        </Link>
        <Link href="/admin/produk" className="nav-link whitespace-nowrap">
          Produk
        </Link>
        <Link href="/admin/kategori" className="nav-link whitespace-nowrap">
          Kategori
        </Link>
        <Link href="/admin/pesanan" className="nav-link whitespace-nowrap">
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
