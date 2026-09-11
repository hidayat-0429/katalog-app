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
    <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center bg-clay text-white min-w-[18px] h-[18px] text-[10px] font-bold rounded-full px-1 shadow-sm">
      {cartItemsCount > 99 ? '99+' : cartItemsCount}
    </span>
  );
}
