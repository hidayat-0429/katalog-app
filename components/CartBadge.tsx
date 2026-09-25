import { prisma } from '@/lib/prisma';

export default async function CartBadge({ userId }: { userId?: string }) {
  if (!userId) {
    return null;
  }

  const cartItemsCount = await prisma.cart.count({
    where: {
      userId,
    },
  });

  if (cartItemsCount === 0) {
    return null;
  }

  return (
    <span className="absolute -top-2 -right-2 flex items-center justify-center bg-brand-forest-600 text-white min-w-[20px] h-[20px] text-[10px] font-bold rounded-full px-1 shadow-sm">
      {cartItemsCount > 99 ? '99+' : cartItemsCount}
    </span>
  );
}
