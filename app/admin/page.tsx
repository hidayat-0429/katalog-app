import { prisma } from '@/lib/prisma'
import { formatRupiah } from '@/lib/format'
import StatusBadge from '@/components/StatusBadge'
import Link from 'next/link'
import { Package, ClipboardList, Users, Clock, TrendingUp, Trophy, ArrowRight, ArrowUpRight } from 'lucide-react'

export default async function AdminDashboardPage() {
  const [totalProduk, totalPesanan, totalUser, pesananPending, totalRevenueResult, produkTerlaris, pesananTerbaru] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.aggregate({
      where: { status: { not: 'DIBATALKAN' } },
      _sum: { totalPrice: true }
    }),
    prisma.orderItem.findMany({
      where: {
        order: {
          status: { not: 'DIBATALKAN' }
        }
      },
      select: {
        productId: true,
        quantity: true,
        product: {
          select: { id: true, name: true }
        }
      }
    }).then(items => {
      const map = new Map<string, { product: { id: string; name: string } | null; quantity: number }>();
      for (const item of items) {
        const existing = map.get(item.productId);
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          map.set(item.productId, { product: item.product, quantity: item.quantity });
        }
      }
      return Array.from(map.entries())
        .sort((a, b) => b[1].quantity - a[1].quantity)
        .slice(0, 5)
        .map(([productId, val]) => ({
          productId,
          _sum: { quantity: val.quantity },
          product: val.product,
        }));
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    })
  ])

  const totalRevenue = totalRevenueResult._sum.totalPrice || 0

  const stats = [
    {
      icon: TrendingUp,
      label: 'Total Nilai Pesanan',
      value: formatRupiah(totalRevenue),
      sub: 'Tidak termasuk yang dibatalkan',
      accent: true,
      href: '/admin/pesanan',
    },
    {
      icon: Clock,
      label: 'Perlu Diproses',
      value: String(pesananPending),
      sub: 'Pesanan menunggu konfirmasi',
      urgent: pesananPending > 0,
      href: '/admin/pesanan?status=PENDING',
    },
    {
      icon: ClipboardList,
      label: 'Total Pesanan',
      value: String(totalPesanan),
      sub: 'Semua waktu',
      href: '/admin/pesanan',
    },
    {
      icon: Package,
      label: 'Total Produk',
      value: String(totalProduk),
      sub: 'Aktif & nonaktif',
      href: '/admin/produk',
    },
    {
      icon: Users,
      label: 'Total Pengguna',
      value: String(totalUser),
      sub: 'Admin & buyer terdaftar',
      href: null,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Ringkasan Operasional
        </h1>
        <p className="font-sans text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Pantau volume pesanan, pendapatan, dan aktivitas produk secara real-time.
        </p>
      </div>

      {/* Stat utama revenue full width */}
      <div className="bg-brand-forest-600 dark:bg-brand-forest-700 rounded-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-brand-forest-700 dark:border-brand-forest-600">
        <div>
          <p className="text-xs uppercase tracking-wide text-white/70 mb-2">Total Nilai Pesanan Aktif</p>
          <p className="font-mono text-4xl font-bold text-white tabular-nums mb-1">{formatRupiah(totalRevenue)}</p>
          <p className="text-xs text-white/60">Akumulasi semua pesanan yang tidak dibatalkan</p>
        </div>
        <Link
          href="/admin/pesanan"
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-150 ease-out shrink-0"
        >
          Lihat Pesanan <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stat grid 2x2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Perlu diproses */}
        <div className={`rounded-lg border p-6 bg-white dark:bg-neutral-800 transition-colors duration-200 ease-out ${pesananPending > 0 ? 'border-semantic-warning-DEFAULT/40 bg-semantic-warning-light/30 dark:bg-semantic-warning-darkBg/20' : 'border-neutral-200 dark:border-neutral-700'}`}>
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-4 ${pesananPending > 0 ? 'bg-semantic-warning-DEFAULT/15 text-semantic-warning-DEFAULT' : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400'}`}>
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-2">Perlu Diproses</p>
            <p className="font-mono text-4xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums mb-1">{pesananPending}</p>
            {pesananPending > 0 && (
              <p className="text-xs text-semantic-warning-dark dark:text-semantic-warning-DEFAULT">Membutuhkan perhatian</p>
            )}
          </div>
          <Link href="/admin/pesanan?status=PENDING" className="text-xs font-semibold text-brand-forest-600 dark:text-brand-forest-400 hover:underline flex items-center gap-1 mt-4">
            Lihat <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Total pesanan */}
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6 transition-colors duration-200 ease-out">
          <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center text-neutral-500 dark:text-neutral-400 mb-4">
            <ClipboardList className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-2">Total Pesanan</p>
            <p className="font-mono text-4xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">{totalPesanan}</p>
          </div>
          <Link href="/admin/pesanan" className="text-xs font-semibold text-brand-forest-600 dark:text-brand-forest-400 hover:underline flex items-center gap-1 mt-4">
            Kelola <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Total produk */}
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6 transition-colors duration-200 ease-out">
          <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center text-neutral-500 dark:text-neutral-400 mb-4">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-2">Total Produk</p>
            <p className="font-mono text-4xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">{totalProduk}</p>
          </div>
          <Link href="/admin/produk" className="text-xs font-semibold text-brand-forest-600 dark:text-brand-forest-400 hover:underline flex items-center gap-1 mt-4">
            Kelola <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Total user */}
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6 transition-colors duration-200 ease-out">
          <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center text-neutral-500 dark:text-neutral-400 mb-4">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-2">Total Pengguna</p>
            <p className="font-mono text-4xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">{totalUser}</p>
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-4 block">Admin &amp; Buyer</span>
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Produk terlaris */}
        <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-semantic-warning-DEFAULT" />
              <h2 className="font-display font-bold text-sm text-neutral-900 dark:text-neutral-100">Produk Paling Dipesan</h2>
            </div>
            <Link href="/admin/produk" className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
              Lihat semua →
            </Link>
          </div>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {produkTerlaris.length === 0 ? (
              <p className="px-6 py-8 text-xs text-neutral-500 dark:text-neutral-400 italic text-center">Belum ada data penjualan</p>
            ) : (
              produkTerlaris.map((item, index) => (
                <div key={item.productId} className="px-6 py-3 flex items-center justify-between gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors duration-150 ease-out">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-md bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 flex items-center justify-center text-[11px] font-bold text-neutral-600 dark:text-neutral-400 shrink-0">
                      {index + 1}
                    </span>
                    <span className="font-sans text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">{item.product?.name || 'Produk'}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-[11px] font-semibold bg-semantic-success-light dark:bg-semantic-success-darkBg text-semantic-success-dark dark:text-green-200 border border-semantic-success-DEFAULT">
                    {item._sum.quantity} terjual
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pesanan terbaru */}
        <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
              <h2 className="font-display font-bold text-sm text-neutral-900 dark:text-neutral-100">Pesanan Terbaru</h2>
            </div>
            <Link href="/admin/pesanan" className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
              Lihat semua →
            </Link>
          </div>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {pesananTerbaru.length === 0 ? (
              <p className="px-6 py-8 text-xs text-neutral-500 dark:text-neutral-400 italic text-center">Belum ada pesanan masuk</p>
            ) : (
              pesananTerbaru.map((order) => (
                <Link key={order.id} href={`/admin/pesanan/${order.id}`} className="px-6 py-3 flex items-center justify-between gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors duration-150 ease-out group">
                  <div className="min-w-0">
                    <p className="font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-brand-forest-600 dark:group-hover:text-brand-forest-400 transition-colors">{order.orderNumber}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">{order.user.name}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={order.status} />
                    <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">{formatRupiah(order.totalPrice)}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
