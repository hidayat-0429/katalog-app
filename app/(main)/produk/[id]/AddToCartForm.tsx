'use client';

import { useState, useTransition } from 'react';
import { Minus, Plus, ShoppingCart, Loader2, PackageCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { addToCart, undoAddToCart } from '@/lib/actions/cart';
import { useToast } from '@/components/Providers';
import { getCartonConversion } from '@/lib/productImage';

interface AddToCartFormProps {
  productId: string;
  maxStock: number;
  unit?: string;
}

export default function AddToCartForm({ productId, maxStock, unit = 'unit' }: AddToCartFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(1);

  const conversion = getCartonConversion(unit, quantity);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddCarton = () => {
    const nextQty = Math.min(maxStock, quantity + conversion.perCarton);
    setQuantity(nextQty);
  };

  const handleIncrease = () => {
    if (quantity < maxStock) {
      setQuantity(quantity + 1);
    }
  };

  const handleAction = (type: 'cart' | 'buy') => {
    if (quantity < 1 || quantity > maxStock) return;

    startTransition(async () => {
      try {
        const res = await addToCart(productId, quantity);
        
        if (res?.error) {
          toast(res.error, { type: 'error' });
        } else {
          if (type === 'buy') {
            router.push('/keranjang');
          } else {
            const addedQty = quantity;
            toast('Berhasil ditambahkan ke keranjang', {
              type: 'success',
              onUndo: async () => {
                await undoAddToCart(productId, addedQty);
              },
            });
            setQuantity(1); // Reset form
            router.refresh();
          }
        }
      } catch (err: any) {
        if (err?.digest?.startsWith('NEXT_REDIRECT') || err?.message?.includes('NEXT_REDIRECT')) {
          throw err;
        }
        toast('Terjadi kesalahan yang tidak terduga', { type: 'error' });
      }
    });
  };

  return (
    <div className="space-y-4">

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
              Jumlah Pesanan ({unit})
            </label>
            {conversion.perCarton > 1 && (
              <button
                type="button"
                onClick={handleAddCarton}
                disabled={quantity + conversion.perCarton > maxStock || isPending}
                className="text-[11px] font-semibold text-brand-forest-600 dark:text-brand-forest-400 hover:underline flex items-center gap-1 disabled:opacity-40"
              >
                <PackageCheck className="w-3.5 h-3.5" />
                <span>+1 {conversion.cartonName} (+{conversion.perCarton})</span>
              </button>
            )}
          </div>

          <div className="flex items-center rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden bg-white dark:bg-neutral-800">
            <button 
              type="button"
              onClick={handleDecrease}
              disabled={quantity <= 1 || isPending}
              className="w-12 h-12 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 disabled:opacity-40 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input 
              type="number"
              min="1"
              max={maxStock}
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val)) {
                  setQuantity(Math.max(1, Math.min(maxStock, val)));
                }
              }}
              className="flex-1 h-12 text-center text-base font-bold text-neutral-900 dark:text-neutral-100 bg-transparent border-x border-neutral-200 dark:border-neutral-700 focus:outline-none tabular-nums"
            />
            <button 
              type="button"
              onClick={handleIncrease}
              disabled={quantity >= maxStock || isPending}
              className="w-12 h-12 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 disabled:opacity-40 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Carton Conversion Hint */}
          <div className="mt-2.5 p-2 rounded-md bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-700/80 flex items-center justify-between text-xs">
            <span className="text-neutral-500 dark:text-neutral-400">Kalkulasi Kemasan Grosir:</span>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">{conversion.text}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mt-2">
        <button 
          type="button"
          onClick={() => handleAction('cart')}
          className="w-full py-3.5 flex items-center justify-center gap-2 text-sm font-semibold bg-brand-forest-50 hover:bg-brand-forest-100 dark:bg-brand-forest-900/30 dark:hover:bg-brand-forest-900/50 text-brand-forest-700 dark:text-brand-forest-300 border border-brand-forest-200 dark:border-brand-forest-800 rounded-lg transition-colors duration-150 disabled:opacity-50"
          disabled={isPending || quantity < 1 || quantity > maxStock}
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
          + Keranjang
        </button>
        <button 
          type="button"
          onClick={() => handleAction('buy')}
          className="w-full py-3.5 flex items-center justify-center gap-2 text-sm font-semibold bg-brand-forest-600 hover:bg-brand-forest-700 text-white rounded-lg transition-colors duration-150 disabled:opacity-50 shadow-sm"
          disabled={isPending || quantity < 1 || quantity > maxStock}
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <PackageCheck className="w-4 h-4" />}
          Pesan Langsung
        </button>
      </div>
    </div>
  );
}
