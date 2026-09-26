'use client';

import Link from 'next/link';
import {
  ChevronRight,
  MapPin,
  Package,
  AlertCircle,
  Calendar,
  Building2,
  ClipboardCheck,
} from 'lucide-react';
import { formatRupiah } from '@/lib/format';
import StatusBadge from '@/components/StatusBadge';
import CancelOrderButton from './CancelOrderButton';
import PrintInvoiceButton from '@/components/PrintInvoiceButton';
import WhatsAppOrderButton from '@/components/WhatsAppOrderButton';
import PaymentInfoCard from '@/components/PaymentInfoCard';
import { useLocale } from '@/components/LocaleProvider';
import { useTranslations } from '@/hooks/useTranslations';
import { fleetLabelKey, parseOrderNotes } from '@/lib/orderNotes';

const STEPS = ['PENDING', 'DIPROSES', 'DIKIRIM', 'SELESAI'] as const;

export interface OrderData {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  buyerName: string;
  companyName: string | null;
  shippingAddress: string;
  notes: string | null;
  totalPrice: number;
  items: {
    id: string;
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
}

export default function OrderDetailClient({ order }: { order: OrderData }) {
  const t = useTranslations();
  const locale = useLocale();
  const dateLocale = locale === 'en' ? 'en-GB' : 'id-ID';

  const statusText = (status: string) =>
    status in t.status ? t.status[status as keyof typeof t.status] : status;

  const currentStepIndex = (STEPS as readonly string[]).indexOf(order.status);
  const isCanceled = order.status === 'DIBATALKAN';
  const created = new Date(order.createdAt);
  const { fleetValue, comment } = parseOrderNotes(order.notes);
  const fk = fleetValue ? fleetLabelKey(fleetValue) : null;
  const fleetText = fk ? t.fleet[fk] : fleetValue;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">

      {/* Breadcrumb + aksi cetak */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 print:hidden">
        <nav className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-sans">
          <Link href="/pesanan" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-150 ease-out">{t.invoice.myOrders}</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="font-semibold text-neutral-900 dark:text-neutral-100 font-mono">{order.orderNumber}</span>
        </nav>
        <PrintInvoiceButton label={t.invoice.print} tooltip={t.invoice.printTooltip} />
      </div>

      {/* Print header */}
      <div className="hidden print:flex items-center justify-between border-b border-stone-300 pb-4 mb-6 font-sans">
        <div>
          <h1 className="font-heading text-xl font-bold text-stone-900">{t.invoice.printTitle}</h1>
          <p className="text-xs text-stone-600 mt-0.5">{t.invoice.printSubtitle}</p>
        </div>
        <div className="text-right text-xs">
          <p className="font-mono font-bold text-stone-900">{order.orderNumber}</p>
          <p className="text-stone-500">{created.toLocaleDateString(dateLocale, { dateStyle: "long" })}</p>
        </div>
      </div>

      {/* Header on-screen */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-5 border-b border-neutral-200 dark:border-neutral-700 print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ClipboardCheck className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
            <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              {t.invoice.title} {order.orderNumber}
            </h1>
          </div>
          <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400">
            {created.toLocaleDateString(dateLocale, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <StatusBadge status={order.status} label={statusText(order.status)} />
      </div>

      {/* Progress timeline */}
      {!isCanceled ? (
        <div className="mb-8 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 print:hidden">
          <div className="relative flex justify-between items-center px-2">
            <div className="absolute left-2 right-2 top-[7px] h-0.5 bg-neutral-200 dark:bg-neutral-700 z-0">
              {currentStepIndex > 0 && (
                <div
                  className="h-full bg-brand-forest-600 dark:bg-brand-forest-700 transition-all duration-500"
                  style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
                />
              )}
            </div>
            {STEPS.map((step, i) => {
              const done = i <= currentStepIndex;
              const current = i === currentStepIndex;
              return (
                <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${done ? "bg-brand-forest-600 dark:bg-brand-forest-700 border-brand-forest-600 dark:border-brand-forest-700" : "bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"} ${current ? "ring-4 ring-brand-forest-500/20" : ""}`} />
                  <span className={`text-[10px] sm:text-xs font-medium ${done ? "text-brand-forest-600 dark:text-brand-forest-400 font-semibold" : "text-neutral-500 dark:text-neutral-400"}`}>
                    {statusText(step)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mb-6 bg-semantic-danger-light dark:bg-semantic-danger-darkBg border border-semantic-danger-DEFAULT/30 rounded-xl p-4 flex items-start gap-3 print:hidden">
          <AlertCircle className="w-5 h-5 text-semantic-danger-dark dark:text-red-300 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm text-semantic-danger-dark dark:text-red-300">{t.invoice.canceled}</p>
            <p className="text-xs text-semantic-danger-dark/80 dark:text-red-300/80 mt-0.5">{t.invoice.canceledDesc}</p>
          </div>
        </div>
      )}

      {/* Info + Rincian */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {/* Info pemesan & pengiriman */}
        <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 flex flex-col gap-4 font-sans">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5" /> {t.invoice.destination}
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 mb-0.5 flex items-center gap-1"><Calendar className="w-3 h-3" /> {t.invoice.transDate}</p>
              <p className="font-medium text-neutral-900 dark:text-neutral-100">
                {created.toLocaleDateString(dateLocale, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 mb-0.5 flex items-center gap-1"><Building2 className="w-3 h-3" /> {t.invoice.buyer}</p>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100">{order.buyerName}</p>
              {order.companyName && (
                <p className="text-neutral-500 dark:text-neutral-400 mt-0.5">{order.companyName}</p>
              )}
            </div>
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 mb-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" /> {t.invoice.shipAddress}</p>
              <p className="text-neutral-900 dark:text-neutral-100 leading-relaxed">{order.shippingAddress}</p>
            </div>
            {fleetText && (
              <div>
                <p className="text-neutral-500 dark:text-neutral-400 mb-0.5">{t.invoice.fleet}</p>
                <p className="text-neutral-900 dark:text-neutral-100">{fleetText}</p>
              </div>
            )}
            {comment && (
              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-700">
                <p className="text-neutral-500 dark:text-neutral-400 mb-0.5">{t.invoice.notes}</p>
                <p className="text-neutral-900 dark:text-neutral-100 italic">&ldquo;{comment}&rdquo;</p>
              </div>
            )}
          </div>
        </div>

        {/* Tabel rincian barang */}
        <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden md:col-span-2 font-sans">
          <div className="px-5 py-3.5 border-b border-neutral-200 dark:border-neutral-700">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">{t.invoice.items}</h2>
          </div>

          <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-2.5 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700 text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            <div className="col-span-6">{t.invoice.colProduct}</div>
            <div className="col-span-2 text-center">{t.invoice.colQty}</div>
            <div className="col-span-2 text-right">{t.invoice.colPrice}</div>
            <div className="col-span-2 text-right">{t.invoice.colSubtotal}</div>
          </div>

          <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {order.items.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 px-5 py-4 items-center text-sm">
                <div className="md:col-span-6">
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">{item.productName}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 md:hidden mt-0.5 font-mono">
                    {item.quantity} &times; {formatRupiah(item.price)}
                  </p>
                </div>
                <div className="hidden md:block md:col-span-2 text-center font-mono text-neutral-500 dark:text-neutral-400 text-xs">{item.quantity}</div>
                <div className="hidden md:block md:col-span-2 text-right font-mono text-neutral-500 dark:text-neutral-400 text-xs">{formatRupiah(item.price)}</div>
                <div className="md:col-span-2 text-right md:text-right font-mono font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                  {formatRupiah(item.subtotal)}
                </div>
              </div>
            ))}
          </div>

          <div className="px-5 py-4 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 flex justify-between items-center">
            <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">{t.invoice.total}</span>
            <span className="font-mono text-xl font-bold text-neutral-900 dark:text-neutral-100">{formatRupiah(order.totalPrice)}</span>
          </div>
        </div>
      </div>

      {/* Kartu pembayaran */}
      {!isCanceled && (
        <div className="mb-6">
          <PaymentInfoCard />
        </div>
      )}

      {/* Action bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-neutral-200 dark:border-neutral-700 print:hidden">
        {!isCanceled ? (
          <WhatsAppOrderButton
            orderNumber={order.orderNumber}
            totalPrice={order.totalPrice}
            customerName={order.buyerName}
            items={order.items.map((i) => ({ productName: i.productName, quantity: i.quantity }))}
          />
        ) : <div />}
        {order.status === "PENDING" && <CancelOrderButton orderId={order.id} />}
      </div>
    </div>
  );
}
