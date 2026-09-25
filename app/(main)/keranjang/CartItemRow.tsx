'use client';

import { useTransition } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { formatRupiah } from '@/lib/format';
import { updateCartItem, removeCartItem } from '@/lib/actions/cart';
import { useRouter } from 'next/navigation';
import { getCartonConversion } from '@/lib/productImage';
import { Card } from '@/components/ui';

interface CartItemRowProps {
  cartId: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  stock: number;
  imageUrl?: string | null;
}

export default function CartItemRow({ cartId, name, price, unit, quantity, stock, imageUrl }: CartItemRowProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const conversion = getCartonConversion(unit, quantity);

  const handleUpdate = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > stock) return;
    startTransition(async () => {
      await updateCartItem(cartId, newQuantity);
      router.refresh();
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      await removeCartItem(cartId);
      router.refresh();
    });
  };

  return (
    <Card className={`p-3 sm:p-4 flex items-center gap-3 sm:gap-4 ${isPending ? 'opacity-50 pointer-events-none' : ''} transition-opacity`}>
      {/* Thumbnail gambar produk */}
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 shrink-0">
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill sizes="64px" className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400 dark:text-neutral-500">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          </div>
        )}
      </div>

      {/* Info produk */}
      <div className="flex-1 min-w-0">
        <h3 className="font-sans font-semibold text-sm text-neutral-900 dark:text-neutral-100 truncate">{name}</h3>
        <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          <span className="font-mono">{formatRupiah(price)}</span>
          <span className="font-sans"> /{unit}</span>
        </p>
        <p className="font-sans text-xs text-brand-forest-600 dark:text-brand-forest-400 font-medium mt-0.5">{conversion.text}</p>
      </div>

      {/* Controls kanan */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Stepper */}
        <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-md overflow-hidden bg-white dark:bg-neutral-800">
          <button
            type="button"
            onClick={() => handleUpdate(quantity - 1)}
            disabled={quantity <= 1 || isPending}
            aria-label="Kurangi jumlah"
            className="w-7 h-7 flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 disabled:opacity-30 transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-8 text-center font-mono text-xs font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => handleUpdate(quantity + 1)}
            disabled={quantity >= stock || isPending}
            aria-label="Tambah jumlah"
            className="w-7 h-7 flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 disabled:opacity-30 transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Subtotal - desktop only */}
        <span className="font-mono text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 min-w-[72px] text-right hidden sm:block">
          {formatRupiah(price * quantity)}
        </span>

        {/* Hapus */}
        <button
          onClick={handleRemove}
          disabled={isPending}
          aria-label={`Hapus ${name} dari keranjang`}
          className="p-1.5 text-neutral-400 dark:text-neutral-500 hover:text-red-500 dark:hover:text-red-400 rounded-md transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
}
