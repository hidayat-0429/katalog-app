'use client';

import { useState, useTransition } from 'react';
import { Minus, Plus, ShoppingCart, CheckCircle, AlertCircle, Loader2, PackageCheck } from 'lucide-react';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity < 1 || quantity > maxStock) return;

    startTransition(async () => {
      try {
        const res = await addToCart(productId, quantity);
        
        if (res?.error) {
          toast(res.error, { type: 'error' });
        } else {
          toast('Berhasil ditambahkan ke keranjang', {
            type: 'success',
            onUndo: async () => {
              await undoAddToCart(productId);
            },
          });
          setQuantity(1); // Reset form
          router.refresh();
        }
      } catch (err) {
        toast('Terjadi kesalahan yang tidak terduga', { type: 'error' });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">




      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-charcoal dark:text-dark-text uppercase tracking-wider">
              Jumlah Pesanan ({unit})
            </label>
            {conversion.perCarton > 1 && (
              <button
                type="button"
                onClick={handleAddCarton}
                disabled={quantity + conversion.perCarton > maxStock || isPending}
                className="text-[11px] font-semibold text-sage dark:text-dark-sage hover:underline flex items-center gap-1 disabled:opacity-40"
              >
                <PackageCheck className="w-3.5 h-3.5" />
                <span>+1 {conversion.cartonName} (+{conversion.perCarton})</span>
              </button>
            )}
          </div>

          <div className="flex items-center rounded-lg border border-border dark:border-dark-border overflow-hidden bg-white dark:bg-dark-surface">
            <button 
              type="button"
              onClick={handleDecrease}
              disabled={quantity <= 1 || isPending}
              className="w-12 h-12 flex items-center justify-center text-charcoal-muted dark:text-dark-muted hover:bg-bg-subtle dark:hover:bg-dark-bg-subtle disabled:opacity-40 transition-colors"
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
              className="flex-1 h-12 text-center text-base font-bold text-charcoal dark:text-dark-text bg-transparent border-x border-border dark:border-dark-border focus:outline-none tabular-nums"
            />
            <button 
              type="button"
              onClick={handleIncrease}
              disabled={quantity >= maxStock || isPending}
              className="w-12 h-12 flex items-center justify-center text-charcoal-muted dark:text-dark-muted hover:bg-bg-subtle dark:hover:bg-dark-bg-subtle disabled:opacity-40 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Carton Conversion Hint */}
          <div className="mt-2.5 p-2 rounded-md bg-bg-subtle dark:bg-dark-bg-subtle border border-border/80 dark:border-dark-border/80 flex items-center justify-between text-xs">
            <span className="text-charcoal-muted dark:text-dark-muted">Kalkulasi Kemasan Grosir:</span>
            <span className="font-semibold text-charcoal dark:text-dark-text">{conversion.text}</span>
          </div>
        </div>
      </div>
      
      <button 
        type="submit" 
        className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 mt-2 text-base font-medium"
        disabled={isPending || quantity < 1 || quantity > maxStock}
      >
        {isPending ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            Tambah ke Keranjang
          </>
        )}
      </button>
    </form>
  );
}
