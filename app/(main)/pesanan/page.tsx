import type { Metadata } from "next";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getServerMessages } from "@/lib/serverMessages";
import PesananPageClient from "./PesananPageClient";
import { OrderStatus } from "@prisma/client";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerMessages();
  return { title: t.metadata.orders, description: t.orders.description };
}

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
    <PesananPageClient
      orders={orders}
      totalCount={totalCount}
      currentPage={currentPage}
      currentStatus={currentStatus}
      totalPages={totalPages}
    />
  );
}
