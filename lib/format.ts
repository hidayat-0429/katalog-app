export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function statusLabel(status: string) {
  const map: Record<string, string> = {
    PENDING: "Menunggu",
    DIPROSES: "Diproses",
    DIKIRIM: "Dikirim",
    SELESAI: "Selesai",
    DIBATALKAN: "Dibatalkan",
  };
  return map[status] ?? status;
}

export function statusColor(status: string) {
  const map: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40",
    DIPROSES: "bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40",
    DIKIRIM: "bg-purple-50 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-900/40",
    SELESAI: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40",
    DIBATALKAN: "bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-900/40",
  };
  return map[status] ?? "bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300";
}
