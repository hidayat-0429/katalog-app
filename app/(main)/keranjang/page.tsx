import { requireUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { getServerMessages } from '@/lib/serverMessages';
import CartPageClient from './CartPageClient';

export async function generateMetadata() {
  const t = await getServerMessages();
  return { title: t.metadata.cart };
}

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
