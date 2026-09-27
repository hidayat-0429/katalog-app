import type { OrderStatus } from "@prisma/client";

export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["DIPROSES", "DIBATALKAN"],
  DIPROSES: ["DIKIRIM", "DIBATALKAN"],
  DIKIRIM: ["SELESAI"],
  SELESAI: [],
  DIBATALKAN: [],
};

// Barang yang sudah diberangkatkan tidak boleh kembali dihitung sebagai stok
export const RESTOCKABLE_STATUSES: OrderStatus[] = ["PENDING", "DIPROSES"];

export function canTransition(from: OrderStatus, to: OrderStatus) {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function shouldRestockOnCancel(from: OrderStatus) {
  return RESTOCKABLE_STATUSES.includes(from);
}
