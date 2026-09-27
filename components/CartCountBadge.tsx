import { prisma } from "@/lib/prisma";
import CartBadge from "@/components/CartBadge";

export default async function CartCountBadge({ userId }: { userId: string | null }) {
  if (!userId) return null;
  const count = await prisma.cart.count({ where: { userId } });
  return <CartBadge count={count} />;
}
