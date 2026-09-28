import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiSuccess, ApiErrors } from "@/lib/utils/apiResponse";
import { getServerMessages } from "@/lib/serverMessages";

export const dynamic = "force-dynamic";

const CACHE_HEADERS = { "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0" };

export async function GET() {
  const t = await getServerMessages();
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== "ADMIN") {
    return ApiErrors.forbidden(t.server.accessDenied, CACHE_HEADERS);
  }

  // Optimized: Use parallel queries instead of nested subqueries
  const [pendingOrdersCount, unreadMessagesCount, lastOrder] = await Promise.all([
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.order.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { orderNumber: true, createdAt: true },
    }),
  ]);

  return apiSuccess(
    {
      pendingOrders: pendingOrdersCount,
      unreadMessages: unreadMessagesCount,
      lastOrderNumber: lastOrder?.orderNumber ?? null,
      lastOrderAt: lastOrder?.createdAt ? lastOrder.createdAt.toISOString() : null,
    },
    200,
    CACHE_HEADERS
  );
}
