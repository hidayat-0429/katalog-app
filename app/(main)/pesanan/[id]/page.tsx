import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import OrderDetailClient from "./OrderDetailClient";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { user: true, items: true },
  });

  if (!order || order.userId !== user.id) notFound();

  return (
    <OrderDetailClient
      order={{
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
        buyerName: order.buyerName || order.user.name,
        companyName: order.companyName || order.user.companyName || null,
        shippingAddress: order.shippingAddress,
        notes: order.notes,
        totalPrice: order.totalPrice,
        items: order.items.map((item) => ({
          id: item.id,
          productName: item.productName || "Produk",
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal ?? item.price * item.quantity,
        })),
      }}
    />
  );
}
