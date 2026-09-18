import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatRupiah } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";
import CancelOrderButton from "./CancelOrderButton";
import PrintInvoiceButton from "@/components/PrintInvoiceButton";
import WhatsAppOrderButton from "@/components/WhatsAppOrderButton";
import PaymentInfoCard from "@/components/PaymentInfoCard";
import { ChevronRight, MapPin, MessageSquare, Calendar, Package, AlertCircle, Building2 } from "lucide-react";


export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order || order.userId !== user.id) {
    notFound();
  }

  const steps = ["PENDING", "DIPROSES", "DIKIRIM", "SELESAI"];
  const currentStepIndex = steps.indexOf(order.status);
  const isCanceled = order.status === "DIBATALKAN";

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 print:hidden">
        <nav className="flex items-center gap-1.5 font-sans text-xs text-charcoal-muted">
          <Link href="/pesanan" className="hover:text-charcoal transition-colors">
            Pesanan Saya
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-charcoal">{order.orderNumber}</span>
        </nav>

        <div className="flex items-center gap-2">
          <PrintInvoiceButton />
        </div>
      </div>

      {/* Printable Invoice Header (Visible on print) */}
      <div className="hidden print:flex items-center justify-between border-b border-stone-300 pb-4 mb-6 font-sans">
        <div>
          <h1 className="font-heading text-xl font-bold text-stone-900">FAKTUR PEMESANAN PASOKAN RESMI</h1>
          <p className="text-xs text-stone-600 mt-0.5">PT EKA TIMUR RAYA (ETIRA MUSHROOMS) PURWODADI, PASURUAN</p>
        </div>
        <div className="text-right text-xs">
          <p className="font-mono font-bold text-stone-900">{order.orderNumber}</p>
          <p className="text-stone-500">
            {new Date(order.createdAt).toLocaleDateString("id-ID", { dateStyle: "long" })}
          </p>
        </div>
      </div>

      {/* Header On Screen */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-4 border-b border-border print:hidden">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-charcoal">Pesanan {order.orderNumber}</h1>
          <p className="font-sans text-xs text-charcoal-muted mt-0.5">ID Referensi: {order.id}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Progress timeline */}
      {!isCanceled ? (
        <div className="mb-8 px-2 print:hidden font-sans">
          <div className="relative flex justify-between items-center w-full">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-border z-0">
              {currentStepIndex > 0 && (
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                />
              )}
            </div>
            
            {steps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <div key={step} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-3.5 h-3.5 rounded-full transition-colors ${
                      isCompleted ? "bg-primary" : "bg-border"
                    } ${isCurrent ? "ring-4 ring-primary-light/50" : ""}`}
                  />
                  <span
                    className={`text-[11px] font-medium ${
                      isCompleted ? "text-primary font-semibold" : "text-charcoal-muted"
                    } absolute top-5 whitespace-nowrap`}
                  >
                    {step === 'PENDING' ? 'Menunggu' : step === 'DIPROSES' ? 'Diproses' : step === 'DIKIRIM' ? 'Dikirim' : 'Selesai'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mb-6 p-3.5 bg-danger-bg border border-danger rounded-md flex items-start gap-2.5 font-sans text-xs text-danger print:hidden">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold">Pesanan Dibatalkan</h3>
            <p className="opacity-90">Pesanan ini telah dibatalkan dan stok produk telah dikembalikan ke gudang.</p>
          </div>
        </div>
      )}

      {/* Order Info & Items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Buyer & Shipping Info */}
        <div className="card p-4 md:col-span-1 flex flex-col gap-3 font-sans">
          <h2 className="font-semibold text-xs uppercase tracking-wider text-charcoal-muted flex items-center gap-1.5 border-b border-border pb-2">
            <Package className="w-3.5 h-3.5" />
            <span>Informasi Tujuan</span>
          </h2>
          
          <div className="text-xs space-y-1">
            <span className="text-charcoal-muted block">Tanggal Transaksi</span>
            <span className="font-medium text-charcoal block">
              {new Date(order.createdAt).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="text-xs space-y-0.5">
            <span className="text-charcoal-muted block">Pemesan</span>
            <span className="font-semibold text-charcoal block">
              {order.buyerName || order.user.name}
            </span>
            {(order.companyName || order.user.companyName) && (
              <span className="text-charcoal-muted block">{order.companyName || order.user.companyName}</span>
            )}
          </div>

          <div className="text-xs space-y-0.5">
            <span className="text-charcoal-muted block">Alamat Kirim</span>
            <span className="text-charcoal block leading-relaxed">
              {order.shippingAddress}
            </span>
          </div>

          {order.notes && (
            <div className="text-xs space-y-0.5 pt-2 border-t border-border">
              <span className="text-charcoal-muted block">Catatan</span>
              <span className="text-charcoal italic block">
                &ldquo;{order.notes}&rdquo;
              </span>
            </div>
          )}
        </div>

        {/* Product Items Table */}
        <div className="card md:col-span-2 overflow-hidden p-0 font-sans">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-xs uppercase tracking-wider text-charcoal-muted">Rincian Barang</h2>
          </div>
          
          <div>
            <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-2.5 text-xs font-semibold text-charcoal-muted bg-bg-subtle border-b border-border">
              <div className="col-span-6">Nama Produk</div>
              <div className="col-span-2 text-center">Jumlah</div>
              <div className="col-span-4 text-right">Subtotal</div>
            </div>
            
            <div className="divide-y divide-border">
              {order.items.map((item) => (
                <div 
                  key={item.id} 
                  className="grid grid-cols-1 md:grid-cols-12 gap-2 p-4 items-center text-xs sm:text-sm"
                >
                  <div className="col-span-1 md:col-span-6">
                    <span className="font-semibold text-charcoal block">
                      {item.productName || item.product?.name}
                    </span>
                    <span className="text-xs text-charcoal-muted md:hidden mt-0.5 block font-mono">
                      {item.quantity} x {formatRupiah(item.price)}
                    </span>
                  </div>
                  <div className="hidden md:block col-span-2 text-center font-mono text-charcoal-muted">
                    {item.quantity}
                  </div>
                  <div className="col-span-1 md:col-span-4 text-right font-mono font-medium text-charcoal">
                    {formatRupiah(item.subtotal || item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-border bg-bg-subtle flex justify-between items-center text-sm">
              <span className="font-semibold text-charcoal">Total Pembayaran</span>
              <span className="font-mono text-xl font-bold text-charcoal">
                {formatRupiah(order.totalPrice)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information Card (Bank Transfer) */}
      {!isCanceled && (
        <div className="mb-6">
          <PaymentInfoCard />
        </div>
      )}

      {/* Bottom Actions Bar (WhatsApp connect & Cancel) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border print:hidden">
        {!isCanceled ? (
          <WhatsAppOrderButton
            orderNumber={order.orderNumber}
            totalPrice={order.totalPrice}
            customerName={order.buyerName || order.user.name}
            items={order.items.map((i) => ({
              productName: i.productName || i.product?.name || "Produk",
              quantity: i.quantity,
            }))}
          />
        ) : <div />}

        {order.status === "PENDING" && (
          <CancelOrderButton orderId={order.id} />
        )}
      </div>
    </div>
  );
}
