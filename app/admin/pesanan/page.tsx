import { prisma } from '@/lib/prisma'
import { formatRupiah, statusLabel } from '@/lib/format'
import StatusBadge from '@/components/StatusBadge'
import Link from 'next/link'
import { OrderStatus } from '@prisma/client'
import ExportOrdersButton from './ExportOrdersButton'
import { Card, Button } from '@/components/ui'

const ITEMS_PER_PAGE = 15;

export default async function AdminOrdersPage({
  searchParams
}: {
  searchParams: Promise<{ status?: string, page?: string }>
}) {
  const { status, page } = await searchParams;
  const currentStatus = status || 'SEMUA'
  const currentPage = Number(page) || 1;
  
  const where = currentStatus !== 'SEMUA' 
    ? { status: currentStatus as OrderStatus } 
    : {}

  const [totalCount, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      include: {
        user: true,
        items: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    })
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const tabs = ['SEMUA', 'PENDING', 'DIPROSES', 'DIKIRIM', 'SELESAI', 'DIBATALKAN']

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-charcoal">Kelola Pesanan</h1>
          <p className="font-sans text-xs sm:text-sm text-charcoal-muted mt-0.5">
            {totalCount} pesanan ditemukan
          </p>
        </div>
        <ExportOrdersButton orders={orders} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 font-sans text-xs">
        {tabs.map(tab => {
          const isActive = tab === currentStatus
          const label = tab === 'SEMUA' ? 'Semua' : statusLabel(tab as OrderStatus)
          return (
            <Link 
              key={tab}
              href={`/admin/pesanan${tab === 'SEMUA' ? '' : `?status=${tab}`}`}
              className={`px-4 py-2 rounded-md font-medium whitespace-nowrap transition-colors border ${
                isActive 
                  ? 'bg-charcoal text-white border-charcoal font-semibold' 
                  : 'bg-transparent border-transparent text-charcoal-muted hover:text-charcoal hover:bg-bg-subtle'
              }`}
            >
              {label}
            </Link>
          )
        })}
      </div>

      {/* Order List */}
      <div className="flex flex-col gap-2.5">
        {orders.length > 0 ? (
          orders.map((order) => (
            <Link key={order.id} href={`/admin/pesanan/${order.id}`} className="block group">
              <Card hover className="p-4 flex flex-col sm:flex-row justify-between gap-3 group-hover:border-charcoal transition-colors font-sans">
                <div className="flex flex-col gap-0.5">
                  <div className="font-mono font-bold text-sm text-charcoal">{order.orderNumber}</div>
                  <div className="text-xs text-charcoal-muted">
                    {order.buyerName || order.user.name} {(order.companyName || order.user.companyName) ? `(${order.companyName || order.user.companyName})` : ''}
                  </div>
                  <div className="text-[11px] text-charcoal-muted">
                    {new Date(order.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5">
                  <div className="font-mono font-bold text-sm sm:text-base text-charcoal">
                    {formatRupiah(order.totalPrice)}
                  </div>
                  <StatusBadge status={order.status} />
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <Card className="p-8 text-center text-charcoal-muted font-sans text-xs">
            Belum ada pesanan{currentStatus !== 'SEMUA' ? ` dengan status ${statusLabel(currentStatus as OrderStatus)}` : ''}.
          </Card>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between font-sans text-sm mt-4">
          <span className="text-xs text-charcoal-muted">
            Halaman {currentPage} dari {totalPages} ({totalCount} pesanan)
          </span>
          <div className="flex gap-2">
            {currentPage > 1 && (
              <Link
                href={`/admin/pesanan?${new URLSearchParams({
                  ...(currentStatus !== 'SEMUA' ? { status: currentStatus } : {}),
                  page: String(currentPage - 1),
                }).toString()}`}
              >
                <Button variant="secondary" className="py-1.5 px-3 text-xs">
                  &larr; Sebelumnya
                </Button>
              </Link>
            )}
            {currentPage < totalPages && (
              <Link
                href={`/admin/pesanan?${new URLSearchParams({
                  ...(currentStatus !== 'SEMUA' ? { status: currentStatus } : {}),
                  page: String(currentPage + 1),
                }).toString()}`}
              >
                <Button variant="secondary" className="py-1.5 px-3 text-xs">
                  Berikutnya &rarr;
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
