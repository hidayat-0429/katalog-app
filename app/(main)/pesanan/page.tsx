import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { formatRupiah } from "@/lib/format";
import { ClipboardList, ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import PaginationControls from "@/components/PaginationControls";
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

const ITEMS_PER_PAGE = 10;

export default async function PesananPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const user = await requireUser();
  const { status, page } = await searchParams;
  const currentStatus = status || "SEMUA";
  const currentPage = Math.max(1, Number(page) || 1);

  const where =
    currentStatus !== "SEMUA"
      ? { userId: user.id, status: currentStatus as OrderStatus }
      : { userId: user.id };

  const [totalCount, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      include: {
        items: {
          select: { productName: true, quantity: true },
          take: 3,
        },
        _count: { select: { items: true } },
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Riwayat Pesanan
        </h1>
        <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Daftar pesanan grosir dan status pemrosesan pasokan Anda
        </p>
      </div>

      {/* Filter Tab */}
      <div className="flex gap-1 overflow-x-auto pb-1 mb-6 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl p-1">
        {STATUS_TABS.map((tab) => {
          const isActive = tab.value === currentStatus;
          return (
            <Link
              key={tab.value}
              href={`/pesanan${tab.value === "SEMUA" ? "" : `?status=${tab.value}`}`}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors duration-150 ease-out ${
                isActive
                  ? "bg-white dark:bg-[#222220] text-neutral-900 dark:text-neutral-100 shadow-sm border border-neutral-200 dark:border-neutral-700"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* List */}
      {orders.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="w-8 h-8" />}
          title="Belum ada pesanan"
          description={
            currentStatus === "SEMUA"
              ? "Pesanan dan faktur Anda akan tercatat di sini."
              : `Tidak ada pesanan dengan status "${STATUS_TABS.find((t) => t.value === currentStatus)?.label}".`
          }
          action={{ label: "Buka Katalog Produk", href: "/?katalog=semua" }}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => {
            const itemPreview = order.items.map((i) => i.productName).join(", ");
            const hasMore = order._count.items > 3;

            return (
              <Link
                key={order.id}
                href={`/pesanan/${order.id}`}
                className="group bg-white dark:bg-[#141715] border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 sm:p-5 flex flex-col gap-3 hover:border-neutral-400 dark:hover:border-neutral-500 sm:hover:-translate-y-0.5 transition-all duration-200 ease-out"
              >
                {/* Baris atas: nomor pesanan + status + total */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-500 dark:text-neutral-400 shrink-0">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100 group-hover:text-brand-forest-600 dark:group-hover:text-brand-forest-400 transition-colors">
                        {order.orderNumber}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                    <StatusBadge status={order.status} />
                    <span className="font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100">
                      {formatRupiah(order.totalPrice)}
                    </span>
                  </div>
                </div>

                {/* Preview item */}
                {order.items.length > 0 && (
                  <div className="flex items-start justify-between gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-700/60">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed flex-1">
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">{order._count.items} produk: </span>
                      {itemPreview}{hasMore && " …"}
                    </p>
                    <span className="text-xs font-semibold text-brand-forest-600 dark:text-brand-forest-400 shrink-0 flex items-center gap-0.5">
                      Detail <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <PaginationControls currentPage={currentPage} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}
