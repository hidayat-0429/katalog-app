export default function CartBadge({ count }: { count: number }) {
  if (count === 0) {
    return null;
  }

  return (
    <span className="absolute -top-2 -right-2 flex items-center justify-center bg-brand-forest-600 text-white min-w-[20px] h-[20px] text-[10px] font-bold rounded-full px-1 shadow-sm">
      {count > 99 ? '99+' : count}
    </span>
  );
}
