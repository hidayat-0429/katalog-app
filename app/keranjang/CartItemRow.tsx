'use client';

import { useTransition } from 'react';
import { Minus, Plus, Trash2, Package } from 'lucide-react';
import { formatRupiah } from '@/lib/format';
import { updateCartItem, removeCartItem } from '@/lib/actions/cart';
import { useRouter } from 'next/navigation';

import { getCartonConversion } from '@/lib/productImage';

interface CartItemRowProps {
  cartId: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  stock: number;
}

export default function CartItemRow({ cartId, name, price, unit, quantity, stock }: CartItemRowProps) {
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
    <div className={`card p-4 flex items-center justify-between gap-4 ${isPending ? 'opacity-50 pointer-events-none' : ''} transition-opacity`}>
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 bg-bg-subtle rounded flex items-center justify-center shrink-0 border border-border text-charcoal-muted">
          <Package className="w-5 h-5" />
        </div>
        
        <div className="min-w-0">
          <h3 className="font-sans font-semibold text-sm text-charcoal truncate">{name}</h3>
          <p className="font-sans text-xs text-charcoal-muted mt-0.5 flex items-center gap-1.5 flex-wrap">
            <span className="font-mono">{formatRupiah(price)} <span className="font-sans">/{unit}</span></span>
            <span>•</span>
            <span className="text-primary font-medium">{conversion.text}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center border border-border rounded overflow-hidden bg-surface">
          <button 
            type="button"
            onClick={() => handleUpdate(quantity - 1)}
            disabled={quantity <= 1 || isPending}
            className="w-7 h-7 flex items-center justify-center text-charcoal hover:bg-bg-subtle disabled:opacity-30 transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-7 text-center font-mono text-xs font-semibold tabular-nums text-charcoal">
            {quantity}
          </span>
          <button 
            type="button"
            onClick={() => handleUpdate(quantity + 1)}
            disabled={quantity >= stock || isPending}
            className="w-7 h-7 flex items-center justify-center text-charcoal hover:bg-bg-subtle disabled:opacity-30 transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        <span className="font-mono text-xs sm:text-sm font-bold text-charcoal min-w-[70px] text-right">
          {formatRupiah(price * quantity)}
        </span>
        
        <button 
          onClick={handleRemove}
          disabled={isPending}
          className="p-1.5 text-charcoal-muted hover:text-danger rounded transition-colors"
          title="Hapus"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
