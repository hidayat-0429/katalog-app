import { prisma } from '@/lib/prisma'
import { formatRupiah, statusLabel } from '@/lib/format'
import StatusBadge from '@/components/StatusBadge'
import Link from 'next/link'
import { OrderStatus } from '@prisma/client'
import ExportOrdersButton from './ExportOrdersButton'
import { Button } from '@/components/ui'

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
          <h1 className="font-display text-xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Kelola Pesanan</h1>
          <p className="font-sans text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
            {totalCount} pesanan ditemukan
          </p>
        </div>
        <ExportOrdersButton currentStatus={currentStatus} />
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
              className={`px-4 py-2 rounded-md font-medium whitespace-nowrap transition-colors duration-150 ease-out border ${
                isActive 
                  ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 font-semibold' 
                  : 'bg-transparent border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800'
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
              <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4 flex flex-col sm:flex-row justify-between gap-3 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors duration-200 ease-out font-sans">
                <div className="flex flex-col gap-0.5">
                  <div className="font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100 tabular-nums">{order.orderNumber}</div>
                  <div className="text-xs text-neutral-700 dark:text-neutral-300">
                    {order.buyerName || order.user.name} {(order.companyName || order.user.companyName) ? `(${order.companyName || order.user.companyName})` : ''}
                  </div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    {new Date(order.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5">
                  <div className="font-mono font-bold text-sm sm:text-base text-neutral-900 dark:text-neutral-100 tabular-nums">
                    {formatRupiah(order.totalPrice)}
                  </div>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-8 text-center text-neutral-500 dark:text-neutral-400 font-sans text-xs">
            Belum ada pesanan{currentStatus !== 'SEMUA' ? ` dengan status ${statusLabel(currentStatus as OrderStatus)}` : ''}.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between font-sans text-sm mt-4">
          <span className="text-xs text-neutral-600 dark:text-neutral-400">
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
