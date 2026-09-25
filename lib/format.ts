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

