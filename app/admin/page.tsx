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
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-charcoal">Ringkasan Operasional</h1>
        <p className="font-sans text-xs sm:text-sm text-charcoal-muted mt-0.5">
          Pantau volume pesanan, pendapatan, dan aktivitas produk
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="w-8 h-8 rounded-full bg-bg-subtle flex items-center justify-center text-charcoal mb-3 border border-border">
            <Package className="w-4 h-4" />
          </div>
          <div className="font-sans text-xs text-charcoal-muted">Total Produk</div>
          <div className="font-mono text-xl sm:text-2xl font-bold text-charcoal mt-0.5">{totalProduk}</div>
        </div>
        
        <div className="card p-4">
          <div className="w-8 h-8 rounded-full bg-bg-subtle flex items-center justify-center text-charcoal mb-3 border border-border">
            <ClipboardList className="w-4 h-4" />
          </div>
          <div className="font-sans text-xs text-charcoal-muted">Total Pesanan</div>
          <div className="font-mono text-xl sm:text-2xl font-bold text-charcoal mt-0.5">{totalPesanan}</div>
        </div>
        
        <div className="card p-4">
          <div className="w-8 h-8 rounded-full bg-bg-subtle flex items-center justify-center text-charcoal mb-3 border border-border">
            <Users className="w-4 h-4" />
          </div>
          <div className="font-sans text-xs text-charcoal-muted">Total Pengguna</div>
          <div className="font-mono text-xl sm:text-2xl font-bold text-charcoal mt-0.5">{totalUser}</div>
        </div>
        
        <div className="card p-4">
          <div className="w-8 h-8 rounded-full bg-bg-subtle flex items-center justify-center text-primary mb-3 border border-border">
            <Clock className="w-4 h-4" />
          </div>
          <div className="font-sans text-xs text-charcoal-muted">Perlu Diproses</div>
          <div className="font-mono text-xl sm:text-2xl font-bold text-primary mt-0.5">{pesananPending}</div>
        </div>
      </div>

      {/* Revenue Card */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-charcoal-muted">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span>Total Nilai Pesanan Aktif</span>
        </div>
        <div className="font-mono text-2xl sm:text-3xl font-bold text-charcoal">
          {formatRupiah(totalRevenue)}
        </div>
        <p className="font-sans text-xs text-charcoal-muted mt-1">
          Akumulasi dari seluruh pesanan yang tidak dibatalkan
        </p>
      </div>

      {/* Grid 2-col */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Produk Terlaris */}
        <div className="card p-5">
          <h2 className="flex items-center gap-2 font-heading font-bold text-sm text-charcoal mb-4 border-b border-border pb-3">
            <Trophy className="w-4 h-4 text-primary" />
            Produk Paling Sering Dipesan
          </h2>
          <div className="space-y-3">
            {produkTerlaris.map((item, index) => (
              <div key={item.productId} className="flex items-center justify-between font-sans text-xs sm:text-sm">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-bg-subtle border border-border flex items-center justify-center text-[11px] font-semibold text-charcoal-muted">
                    {index + 1}
                  </span>
                  <span className="font-medium text-charcoal">{item.product?.name || 'Produk'}</span>
                </div>
                <span className="text-xs text-charcoal-muted">
                  {item._sum.quantity} terjual
                </span>
              </div>
            ))}
            {produkTerlaris.length === 0 && (
              <div className="font-sans text-charcoal-muted text-xs italic">Belum ada data penjualan</div>
            )}
          </div>
        </div>

        {/* Pesanan Terbaru */}
        <div className="card p-5">
          <h2 className="flex items-center gap-2 font-heading font-bold text-sm text-charcoal mb-4 border-b border-border pb-3">
            <Clock className="w-4 h-4 text-charcoal-muted" />
            Pesanan Masuk Terbaru
          </h2>
          <div className="space-y-2.5">
            {pesananTerbaru.map((order) => (
              <Link key={order.id} href={`/admin/pesanan/${order.id}`} className="block group">
                <div className="flex flex-col gap-1 p-2.5 rounded-md border border-border hover:border-charcoal transition-colors font-sans">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-semibold text-charcoal group-hover:underline">
                      {order.orderNumber}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="flex justify-between items-center text-xs text-charcoal-muted">
                    <span>{order.user.name}</span>
                    <span className="font-mono font-semibold text-charcoal">{formatRupiah(order.totalPrice)}</span>
                  </div>
                </div>
              </Link>
            ))}
            {pesananTerbaru.length === 0 && (
              <div className="font-sans text-charcoal-muted text-xs italic">Belum ada pesanan masuk</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
