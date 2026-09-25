import { requireUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import CartPageClient from './CartPageClient';

export default async function CartPage() {
  const user = await requireUser();

  const [cartItems, dbUser] = await Promise.all([
    prisma.cart.findMany({
      where: { userId: user.id },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.findUnique({
      where: { id: user.id },
      select: { address: true },
    }),
  ]);

  return <CartPageClient cartItems={cartItems} defaultAddress={dbUser?.address || ''} />;
}
