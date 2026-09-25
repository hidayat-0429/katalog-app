"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { OrderStatus } from "@prisma/client";

export async function getAllOrdersForExport(status?: string) {
  await requireAdmin();

  const where =
    status && status !== "SEMUA" ? { status: status as OrderStatus } : {};

  const orders = await prisma.order.findMany({
    where,
    include: {
      user: true,
      items: {
        select: {
          productName: true,
          quantity: true,
          price: true,
          subtotal: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders;
}
