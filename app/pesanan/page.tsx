import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { formatRupiah } from "@/lib/format";
import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { OrderStatus } from "@prisma/client";

export const metadata = {
  title: "Pesanan Saya | Etira Mushrooms",
};

const STATUS_TABS = [
  { value: "SEMUA", label: "Semua" },
  { value: "PENDING", label: "Menunggu" },
  { value: "DIPROSES", label: "Diproses" },
  { value: "DIKIRIM", label: "Dikirim" },
  { value: "SELESAI", label: "Selesai" },
  { value: "DIBATALKAN", label: "Dibatalkan" },
] as const;

export default async function PesananPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await requireUser();
  const { status } = await searchParams;
  const currentStatus = status || "SEMUA";

  const where =
    currentStatus !== "SEMUA"
      ? { userId: user.id, status: currentStatus as OrderStatus }
      : { userId: user.id };

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        select: { productName: true, quantity: true },
        take: 3, // Ambil 3 item pertama untuk preview
      },
      _count: { select: { items: true } },
    },
  });

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

      {/* Filter Status Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 font-sans text-xs mb-5">
        {STATUS_TABS.map((tab) => {
          const isActive = tab.value === currentStatus;
          return (
            <Link
              key={tab.value}
              href={`/pesanan${tab.value === "SEMUA" ? "" : `?status=${tab.value}`}`}
              className={`px-4 py-2 rounded-md font-medium whitespace-nowrap transition-colors border ${
                isActive
                  ? "bg-charcoal text-white border-charcoal font-semibold"
                  : "bg-transparent border-transparent text-charcoal-muted hover:text-charcoal hover:bg-bg-subtle"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="w-8 h-8" />}
          title="Belum ada pesanan aktif"
          description={
            currentStatus === "SEMUA"
              ? "Daftar transaksi dan faktur pemesanan Anda akan tercatat di sini."
              : `Tidak ada pesanan dengan status "${STATUS_TABS.find((t) => t.value === currentStatus)?.label}".`
          }
          action={{ label: "Buka Katalog Produk", href: "/#katalog" }}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => {
            // Preview ringkasan item
            const itemPreview = order.items
              .map((i) => i.productName)
              .join(", ");
            const hasMore = order._count.items > 3;

            return (
              <Link
                key={order.id}
                href={`/pesanan/${order.id}`}
                className="card p-4 sm:p-5 flex flex-col gap-3 hover:border-charcoal transition-colors"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
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

                  <div className="flex sm:flex-col sm:items-end gap-2">
                    <span className="font-mono font-bold text-sm sm:text-base text-charcoal">
                      {formatRupiah(order.totalPrice)}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                </div>

                {/* Item preview */}
                {order.items.length > 0 && (
                  <p className="font-sans text-xs text-charcoal-muted border-t border-border pt-2.5 leading-relaxed">
                    <span className="font-medium text-charcoal">
                      {order._count.items} produk:{" "}
                    </span>
                    {itemPreview}
                    {hasMore && " ..."}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
