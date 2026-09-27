import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

type InboxRow = {
  pendingOrders: bigint;
  unreadMessages: bigint;
  lastOrderNumber: string | null;
  lastOrderAt: Date | null;
};

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Akses ditolak: hanya admin" },
      { status: 403, headers: NO_STORE }
    );
  }

  // Satu kali bolak-balik ke database remote ±175 ms, jadi semua angka diambil
  // dalam satu query gabungan. bigint dari PostgreSQL dikonversi ke number.
  const [row] = await prisma.$queryRaw<InboxRow[]>`SELECT
      (SELECT count(*) FROM "Order" WHERE status = 'PENDING') AS "pendingOrders",
      (SELECT count(*) FROM "ContactMessage" WHERE "isRead" = false) AS "unreadMessages",
      (SELECT "orderNumber" FROM "Order" ORDER BY "createdAt" DESC LIMIT 1) AS "lastOrderNumber",
      (SELECT "createdAt" FROM "Order" ORDER BY "createdAt" DESC LIMIT 1) AS "lastOrderAt"`;

  return NextResponse.json(
    {
      pendingOrders: Number(row?.pendingOrders ?? 0),
      unreadMessages: Number(row?.unreadMessages ?? 0),
      lastOrderNumber: row?.lastOrderNumber ?? null,
      lastOrderAt: row?.lastOrderAt ? new Date(row.lastOrderAt).toISOString() : null,
    },
    { headers: NO_STORE }
  );
}
