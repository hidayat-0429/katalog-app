import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { formatRupiah } from "@/lib/format";
import { ClipboardList } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Pesanan Saya | Katalog Pasokan Pangan",
};

export default async function PesananPage() {
  const user = await requireUser();

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-4">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-charcoal mb-6">
          Riwayat Pesanan
        </h1>
        <EmptyState
          icon={<ClipboardList className="w-8 h-8" />}
          title="Belum ada pesanan aktif"
          description="Daftar transaksi dan faktur pemesanan Anda akan tercatat di sini."
          action={{ label: "Buka Katalog Produk", href: "/#katalog" }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-4">
      <div className="mb-6 pb-4 border-b border-border">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-charcoal">
          Riwayat Pesanan
        </h1>
        <p className="font-sans text-xs sm:text-sm text-charcoal-muted mt-0.5">
          Daftar pesanan grosir dan status pemrosesan pasokan Anda
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/pesanan/${order.id}`}
            className="card p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:border-charcoal transition-colors"
          >
            <div>
              <span className="font-mono font-bold text-sm sm:text-base text-charcoal block">
                {order.orderNumber}
              </span>
              <span className="font-sans text-xs text-charcoal-muted mt-0.5 block">
                {new Date(order.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex sm:flex-col sm:items-end justify-between items-center w-full sm:w-auto gap-1">
              <span className="font-mono font-bold text-sm sm:text-base text-charcoal">
                {formatRupiah(order.totalPrice)}
              </span>
              <StatusBadge status={order.status} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
