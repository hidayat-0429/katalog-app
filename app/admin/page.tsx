import { prisma } from '@/lib/prisma'
import { formatRupiah } from '@/lib/format'
import StatusBadge from '@/components/StatusBadge'
import Link from 'next/link'
import { Package, ClipboardList, Users, Clock, TrendingUp, Trophy } from 'lucide-react'

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
    prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5
    }).then(async items => {
      const productIds = items.map(item => item.productId)
      const products = await prisma.product.findMany({ where: { id: { in: productIds } } })
      return items.map(item => ({
        ...item,
        product: products.find(p => p.id === item.productId)
      }))
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    })
  ])

  const totalRevenue = totalRevenueResult._sum.totalPrice || 0

  return (
    <div className="space-y-6 text-charcoal dark:text-dark-text">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Ringkasan Operasional</h1>
        <p className="text-xs sm:text-sm text-charcoal-muted dark:text-dark-muted mt-0.5">
          Pantau volume pesanan, pendapatan, dan aktivitas produk
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="w-8 h-8 rounded bg-bg-subtle dark:bg-dark-bg-subtle flex items-center justify-center text-charcoal dark:text-dark-text mb-3 border border-border dark:border-dark-border">
            <Package className="w-4 h-4" />
          </div>
          <div className="text-xs text-charcoal-muted dark:text-dark-muted">Total Produk</div>
          <div className="text-xl sm:text-2xl font-bold text-charcoal dark:text-dark-text mt-0.5">{totalProduk}</div>
        </div>
        
        <div className="card p-4">
          <div className="w-8 h-8 rounded bg-bg-subtle dark:bg-dark-bg-subtle flex items-center justify-center text-charcoal dark:text-dark-text mb-3 border border-border dark:border-dark-border">
            <ClipboardList className="w-4 h-4" />
          </div>
          <div className="text-xs text-charcoal-muted dark:text-dark-muted">Total Pesanan</div>
          <div className="text-xl sm:text-2xl font-bold text-charcoal dark:text-dark-text mt-0.5">{totalPesanan}</div>
        </div>
        
        <div className="card p-4">
          <div className="w-8 h-8 rounded bg-bg-subtle dark:bg-dark-bg-subtle flex items-center justify-center text-charcoal dark:text-dark-text mb-3 border border-border dark:border-dark-border">
            <Users className="w-4 h-4" />
          </div>
          <div className="text-xs text-charcoal-muted dark:text-dark-muted">Total Pengguna</div>
          <div className="text-xl sm:text-2xl font-bold text-charcoal dark:text-dark-text mt-0.5">{totalUser}</div>
        </div>
        
        <div className="card p-4">
          <div className="w-8 h-8 rounded bg-bg-subtle dark:bg-dark-bg-subtle flex items-center justify-center text-charcoal dark:text-dark-text mb-3 border border-border dark:border-dark-border">
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-xs text-charcoal-muted dark:text-dark-muted">Perlu Diproses</div>
          <div className="text-xl sm:text-2xl font-bold text-charcoal dark:text-dark-text mt-0.5">{pesananPending}</div>
        </div>
      </div>

      {/* Revenue Card */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-dark-muted">
          <TrendingUp className="w-4 h-4 text-sage dark:text-dark-sage" />
          <span>Total Nilai Pesanan Aktif</span>
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-charcoal dark:text-dark-text">
          {formatRupiah(totalRevenue)}
        </div>
        <p className="text-xs text-charcoal-muted dark:text-dark-muted mt-1">
          Akumulasi dari seluruh pesanan yang tidak dibatalkan
        </p>
      </div>

      {/* Grid 2-col */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Produk Terlaris */}
        <div className="card p-5">
          <h2 className="flex items-center gap-2 font-bold text-sm text-charcoal dark:text-dark-text mb-4 border-b border-border dark:border-dark-border pb-3">
            <Trophy className="w-4 h-4 text-sage dark:text-dark-sage" />
            Produk Paling Sering Dipesan
          </h2>
          <div className="space-y-3">
            {produkTerlaris.map((item, index) => (
              <div key={item.productId} className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded bg-bg-subtle dark:bg-dark-surface border border-border dark:border-dark-border flex items-center justify-center text-[11px] font-semibold text-charcoal-muted dark:text-dark-muted">
                    {index + 1}
                  </span>
                  <span className="font-medium text-charcoal dark:text-dark-text">{item.product?.name || 'Produk'}</span>
                </div>
                <span className="text-xs text-charcoal-muted dark:text-dark-muted">
                  {item._sum.quantity} terjual
                </span>
              </div>
            ))}
            {produkTerlaris.length === 0 && (
              <div className="text-charcoal-muted dark:text-dark-muted text-xs italic">Belum ada data penjualan</div>
            )}
          </div>
        </div>

        {/* Pesanan Terbaru */}
        <div className="card p-5">
          <h2 className="flex items-center gap-2 font-bold text-sm text-charcoal dark:text-dark-text mb-4 border-b border-border dark:border-dark-border pb-3">
            <Clock className="w-4 h-4 text-charcoal-muted dark:text-dark-muted" />
            Pesanan Masuk Terbaru
          </h2>
          <div className="space-y-2.5">
            {pesananTerbaru.map((order) => (
              <Link key={order.id} href={`/admin/pesanan/${order.id}`} className="block group">
                <div className="flex flex-col gap-1 p-2.5 rounded border border-border dark:border-dark-border hover:border-charcoal dark:hover:border-dark-text transition-colors">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-charcoal dark:text-dark-text group-hover:underline">
                      {order.orderNumber}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="flex justify-between items-center text-xs text-charcoal-muted dark:text-dark-muted">
                    <span>{order.user.name}</span>
                    <span className="font-semibold text-charcoal dark:text-dark-text">{formatRupiah(order.totalPrice)}</span>
                  </div>
                </div>
              </Link>
            ))}
            {pesananTerbaru.length === 0 && (
              <div className="text-charcoal-muted dark:text-dark-muted text-xs italic">Belum ada pesanan masuk</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
