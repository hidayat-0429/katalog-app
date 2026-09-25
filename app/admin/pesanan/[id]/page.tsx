import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import StatusBadge from '@/components/StatusBadge'
import OrderStatusForm from './OrderStatusForm'
import PrintInvoiceButton from '@/components/PrintInvoiceButton'
import { formatRupiah } from '@/lib/format'
import { User, MapPin, Package, ChevronRight, ArrowLeft } from 'lucide-react'

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: { user: true, items: { include: { product: true } } }
  })

  if (!order) notFound()

  return (
    <div className="space-y-6">

      {/* Breadcrumb */}
      <div className="flex items-center justify-between gap-2 print:hidden">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/pesanan"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-150 ease-out border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-1.5 hover:border-neutral-300 dark:hover:border-neutral-600"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali
          </Link>
          <nav className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
            <Link href="/admin/pesanan" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-150 ease-out">Daftar Pesanan</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 font-mono">{order.orderNumber}</span>
          </nav>
        </div>
        <PrintInvoiceButton />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-5 border-b border-neutral-200 dark:border-neutral-700">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Pesanan {order.orderNumber}
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
            {new Date(order.createdAt).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Info grid */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Pelanggan */}
        <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-5">
          <h2 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-4">
            <User className="w-3.5 h-3.5" /> Informasi Pelanggan
          </h2>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between gap-3">
              <span className="text-neutral-600 dark:text-neutral-400 shrink-0">Nama</span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-right">{order.buyerName || order.user.name}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-neutral-600 dark:text-neutral-400 shrink-0">Email</span>
              <span className="text-neutral-900 dark:text-neutral-100 text-right break-all">{order.buyerEmail || order.user.email}</span>
            </div>
            {(order.companyName || order.user.companyName) && (
              <div className="flex justify-between gap-3">
                <span className="text-neutral-600 dark:text-neutral-400 shrink-0">Perusahaan</span>
                <span className="text-neutral-900 dark:text-neutral-100 text-right">{order.companyName || order.user.companyName}</span>
              </div>
            )}
            {(order.buyerPhone || order.user.phone) && (
              <div className="flex justify-between gap-3">
                <span className="text-neutral-600 dark:text-neutral-400 shrink-0">Telepon</span>
                <span className="text-neutral-900 dark:text-neutral-100 text-right">{order.buyerPhone || order.user.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Pengiriman */}
        <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-5">
          <h2 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-4">
            <MapPin className="w-3.5 h-3.5" /> Tujuan Pengiriman
          </h2>
          <div className="space-y-2.5 text-xs">
            <div>
              <p className="text-neutral-600 dark:text-neutral-400 mb-1">Alamat</p>
              <p className="text-neutral-900 dark:text-neutral-100 leading-relaxed">{order.shippingAddress || '-'}</p>
            </div>
            {order.notes && (
              <div className="pt-2.5 border-t border-neutral-200 dark:border-neutral-700">
                <p className="text-neutral-600 dark:text-neutral-400 mb-1">Catatan</p>
                <p className="text-neutral-900 dark:text-neutral-100 italic">&ldquo;{order.notes}&rdquo;</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabel barang */}
      <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-neutral-200 dark:border-neutral-700 flex items-center gap-1.5">
          <Package className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">Barang Dipesan</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-700/50 border-b border-neutral-200 dark:border-neutral-700">
                <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">Produk</th>
                <th className="px-5 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">Harga</th>
                <th className="px-5 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">Qty</th>
                <th className="px-5 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {order.items.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors duration-150 ease-out">
                  <td className="px-5 py-3.5 font-medium text-sm text-neutral-900 dark:text-neutral-100">
                    {item.product?.name || item.productName || 'Produk'}
                  </td>
                  <td className="px-5 py-3.5 text-center font-mono text-xs text-neutral-600 dark:text-neutral-400">
                    {formatRupiah(item.price)}
                  </td>
                  <td className="px-5 py-3.5 text-center font-mono text-sm text-neutral-900 dark:text-neutral-100">
                    {item.quantity}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                    {formatRupiah(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-neutral-50 dark:bg-neutral-700/50 border-t border-neutral-200 dark:border-neutral-700">
                <td colSpan={3} className="px-5 py-4 text-right font-semibold text-sm text-neutral-900 dark:text-neutral-100">Total Nilai Pesanan</td>
                <td className="px-5 py-4 text-right font-mono font-bold text-lg text-neutral-900 dark:text-neutral-100">
                  {formatRupiah(order.totalPrice)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Form update status */}
      <OrderStatusForm orderId={order.id} currentStatus={order.status} />
    </div>
  )
}
