import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import StatusBadge from '@/components/StatusBadge'
import OrderStatusForm from './OrderStatusForm'
import PrintInvoiceButton from '@/components/PrintInvoiceButton'
import { formatRupiah } from '@/lib/format'
import { User, MapPin, Package } from 'lucide-react'

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      items: {
        include: { product: true }
      }
    }
  })

  if (!order) notFound()

  return (
    <div className="space-y-5 text-charcoal dark:text-dark-text">
      <div className="text-xs text-charcoal-muted dark:text-dark-muted flex items-center justify-between gap-2 print:hidden">
        <div className="flex items-center gap-1.5">
          <Link href="/admin/pesanan" className="hover:text-charcoal dark:hover:text-dark-text transition-colors">Daftar Pesanan</Link>
          <span>/</span>
          <span className="font-semibold text-charcoal dark:text-dark-text">{order.orderNumber}</span>
        </div>
        <PrintInvoiceButton />
      </div>

      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-3 border-b border-border dark:border-dark-border">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Detail Pesanan {order.orderNumber}</h1>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Customer Info Card */}
        <div className="card p-5 space-y-3">
          <h2 className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-charcoal-muted dark:text-dark-muted border-b border-border dark:border-dark-border pb-2">
            <User className="w-4 h-4" /> Informasi Pelanggan
          </h2>
          <div className="space-y-1.5 text-xs">
            <p><span className="text-charcoal-muted dark:text-dark-muted">Nama:</span> <strong className="font-medium text-charcoal dark:text-dark-text ml-1">{order.user.name}</strong></p>
            <p><span className="text-charcoal-muted dark:text-dark-muted">Email:</span> <span className="text-charcoal dark:text-dark-text ml-1">{order.user.email}</span></p>
            {order.user.companyName && <p><span className="text-charcoal-muted dark:text-dark-muted">Perusahaan:</span> <span className="text-charcoal dark:text-dark-text ml-1">{order.user.companyName}</span></p>}
            {order.user.phone && <p><span className="text-charcoal-muted dark:text-dark-muted">Telepon:</span> <span className="text-charcoal dark:text-dark-text ml-1">{order.user.phone}</span></p>}
          </div>
        </div>

        {/* Shipping Card */}
        <div className="card p-5 space-y-3">
          <h2 className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-charcoal-muted dark:text-dark-muted border-b border-border dark:border-dark-border pb-2">
            <MapPin className="w-4 h-4" /> Tujuan Pengiriman
          </h2>
          <div className="space-y-1.5 text-xs">
            <p><span className="text-charcoal-muted dark:text-dark-muted block">Alamat:</span> <span className="text-charcoal dark:text-dark-text block leading-relaxed">{order.shippingAddress || '-'}</span></p>
            {order.notes && (
              <p className="pt-1"><span className="text-charcoal-muted dark:text-dark-muted block">Catatan Tambahan:</span> <span className="text-charcoal dark:text-dark-text italic block">&ldquo;{order.notes}&rdquo;</span></p>
            )}
          </div>
        </div>
      </div>

      {/* Items Card */}
      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-border dark:border-dark-border">
          <h2 className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-charcoal-muted dark:text-dark-muted">
            <Package className="w-4 h-4" /> Barang yang Dipesan
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-bg-subtle dark:bg-dark-bg-subtle text-charcoal-muted dark:text-dark-muted border-b border-border dark:border-dark-border">
              <tr>
                <th className="p-3.5 font-semibold">Produk</th>
                <th className="p-3.5 font-semibold text-center">Harga</th>
                <th className="p-3.5 font-semibold text-center">Jumlah</th>
                <th className="p-3.5 font-semibold text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-dark-border">
              {order.items.map((item) => (
                <tr key={item.id} className="hover:bg-bg-subtle/40 dark:hover:bg-dark-surface/40 transition-colors">
                  <td className="p-3.5 font-medium text-charcoal dark:text-dark-text">{item.product?.name || item.productName || 'Produk'}</td>
                  <td className="p-3.5 text-center text-charcoal-muted dark:text-dark-muted">{formatRupiah(item.price)}</td>
                  <td className="p-3.5 text-center text-charcoal-muted dark:text-dark-muted">{item.quantity}</td>
                  <td className="p-3.5 text-right font-medium text-charcoal dark:text-dark-text">{formatRupiah(item.price * item.quantity)}</td>
                </tr>
              ))}
              <tr className="bg-bg-subtle dark:bg-dark-bg-subtle">
                <td colSpan={3} className="p-3.5 text-right font-semibold text-charcoal dark:text-dark-text">Total Nilai Pesanan</td>
                <td className="p-3.5 text-right font-bold text-sm sm:text-base text-charcoal dark:text-dark-text">
                  {formatRupiah(order.totalPrice)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Form */}
      <OrderStatusForm orderId={order.id} currentStatus={order.status} />
    </div>
  )
}
