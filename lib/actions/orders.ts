"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin, requireUser } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";
import { statusLabel } from "@/lib/format";
import { getServerMessages } from "@/lib/serverMessages";

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["DIPROSES", "DIBATALKAN"],
  DIPROSES: ["DIKIRIM", "DIBATALKAN"],
  DIKIRIM: ["SELESAI"],
  SELESAI: [],
  DIBATALKAN: [],
};

// Barang yang sudah diberangkatkan tidak boleh kembali dihitung sebagai stok
const RESTOCKABLE_STATUSES: OrderStatus[] = ["PENDING", "DIPROSES"];

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await requireAdmin();

  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new Error("Pesanan tidak ditemukan");
    }

    if (!ALLOWED_TRANSITIONS[order.status].includes(status)) {
      throw new Error(`Pesanan berstatus ${statusLabel(order.status)} tidak bisa diubah ke ${statusLabel(status)}`);
    }

    // Ambil transisinya secara atomik supaya dua admin tidak sama-sama mengembalikan stok
    const { count } = await tx.order.updateMany({
      where: { id: orderId, status: order.status },
      data: { status },
    });
    if (count === 0) {
      throw new Error("Status pesanan baru saja diubah, muat ulang halaman ini");
    }

    if (status === "DIBATALKAN" && RESTOCKABLE_STATUSES.includes(order.status)) {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }
  });

  revalidatePath("/admin/pesanan");
  revalidatePath(`/admin/pesanan/${orderId}`);
  revalidatePath("/pesanan");
  revalidatePath(`/pesanan/${orderId}`);
  revalidatePath("/");
}


export async function cancelOrder(orderId: string) {
  const user = await requireUser();
  const t = await getServerMessages();

  try {
    await prisma.$transaction(async (tx) => {
      // Klaim pembatalannya bersyarat supaya dua klik tidak sama-sama mengembalikan stok
      const { count } = await tx.order.updateMany({
        where: { id: orderId, userId: user.id, status: "PENDING" },
        data: { status: "DIBATALKAN" },
      });

      if (count === 0) {
        const existing = await tx.order.findUnique({ where: { id: orderId } });
        if (!existing || existing.userId !== user.id) {
          throw new Error(t.server.orderNotFound);
        }
        throw new Error(t.server.orderAlreadyProcessed);
      }

      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      for (const item of order?.items ?? []) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
    });

    revalidatePath("/pesanan");
    revalidatePath(`/pesanan/${orderId}`);
    return { success: true };
  } catch (err: any) {
    return { error: err?.message || t.server.cancelFailed };
  }
}
