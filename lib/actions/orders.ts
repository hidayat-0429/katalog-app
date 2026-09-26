"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin, requireUser } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";
import { getServerMessages } from "@/lib/serverMessages";

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

    if (order.status === "DIBATALKAN") {
      throw new Error("Pesanan yang sudah dibatalkan tidak dapat diubah statusnya lagi");
    }

    // Jika admin membatalkan pesanan, kembalikan stok barang ke gudang
    if (status === "DIBATALKAN") {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }

    await tx.order.update({
      where: { id: orderId },
      data: { status },
    });
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
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!order || order.userId !== user.id) {
        throw new Error(t.server.orderNotFound);
      }
      if (order.status !== "PENDING") {
        throw new Error(t.server.orderAlreadyProcessed);
      }

      await tx.order.update({
        where: { id: orderId },
        data: { status: "DIBATALKAN" },
      });

      for (const item of order.items) {
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
