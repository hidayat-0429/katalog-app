'use client';

import { useState, useTransition } from 'react';
import { ShoppingBag, MapPin, MessageSquare, AlertCircle, Loader2, Truck } from 'lucide-react';
import { checkout } from '@/lib/actions/cart';

interface CheckoutFormProps {
  defaultAddress?: string;
}

export default function CheckoutForm({ defaultAddress = '' }: CheckoutFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        const res = await checkout(formData);
        if (res?.error) {
          setError(res.error);
        }
      } catch (err: any) {
        if (err?.message?.includes('NEXT_REDIRECT')) {
          throw err;
        }
        setError(err?.message || 'Terjadi kesalahan saat memproses pesanan');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 pt-3 text-xs">
      {error && (
        <div className="text-xs text-[#B91C1C] dark:text-[#F87171] bg-red-50 dark:bg-red-950/20 p-2.5 rounded border border-red-200 dark:border-red-900/30 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="font-medium text-charcoal dark:text-dark-text mb-1 flex items-center gap-1" htmlFor="shippingMethod">
          <Truck className="w-3.5 h-3.5 text-charcoal-muted dark:text-dark-muted" />
          <span>Metode Armada Pengiriman</span>
        </label>
        <select
          id="shippingMethod"
          name="shippingMethod"
          disabled={isPending}
          className="input w-full text-xs disabled:opacity-50 cursor-pointer"
          defaultValue="Armada Truk Berpendingin (Cold Chain)"
        >
          <option value="Armada Truk Berpendingin (Cold Chain)">
            ❄️ Armada Truk Berpendingin (Cold Chain - Rekomendasi Jamur Segar &amp; Beku)
          </option>
          <option value="Kargo Logistik Kering (Kaleng &amp; Pouch)">
            📦 Kargo Logistik Kering (Khusus Kaleng &amp; Pouch Steril)
          </option>
          <option value="Ambil Mandiri di Pabrik (Purwodadi, Pasuruan)">
            🏭 Ambil Mandiri di Gudang Pabrik (Purwodadi, Pasuruan)
          </option>
        </select>
      </div>

      <div>
        <label className="font-medium text-charcoal dark:text-dark-text mb-1 flex items-center gap-1" htmlFor="shippingAddress">
          <MapPin className="w-3.5 h-3.5 text-charcoal-muted dark:text-dark-muted" />
          <span>Alamat Pengiriman Tujuan</span>
        </label>
        <textarea
          id="shippingAddress"
          name="shippingAddress"
          required
          defaultValue={defaultAddress}
          rows={3}
          disabled={isPending}
          className="input w-full resize-none text-xs disabled:opacity-50"
          placeholder="Alamat lengkap tujuan kirim..."
        />
      </div>

      <div>
        <label className="font-medium text-charcoal dark:text-dark-text mb-1 flex items-center gap-1" htmlFor="notes">
          <MessageSquare className="w-3.5 h-3.5 text-charcoal-muted dark:text-dark-muted" />
          <span>Catatan Khusus (Opsional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          disabled={isPending}
          className="input w-full resize-none text-xs disabled:opacity-50"
          placeholder="Contoh: Titip di pos satpam / hubungi penerima..."
        />
      </div>
      
      <button type="submit" disabled={isPending} className="btn-primary w-full py-2.5 mt-2">
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Memproses Pesanan...</span>
          </>
        ) : (
          <>
            <ShoppingBag className="w-4 h-4" />
            <span>Proses Pemesanan</span>
          </>
        )}
      </button>
    </form>
  );
}
