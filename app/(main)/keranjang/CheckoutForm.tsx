'use client';

import { useState, useTransition } from 'react';
import { ShoppingBag, MapPin, MessageSquare, AlertCircle, Loader2, Truck } from 'lucide-react';
import { checkout } from '@/lib/actions/cart';
import { Button } from '@/components/ui';

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
    <form onSubmit={handleSubmit} className="space-y-4 pt-3 text-sm font-sans">
      {error && (
        <div className="text-sm text-danger bg-danger-bg p-3 rounded-md border border-danger flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="font-semibold text-charcoal mb-1.5 flex items-center gap-1.5 text-xs uppercase tracking-wider" htmlFor="shippingMethod">
          <Truck className="w-4 h-4 text-charcoal-muted" />
          <span>Metode Armada Pengiriman</span>
        </label>
        <select
          id="shippingMethod"
          name="shippingMethod"
          disabled={isPending}
          className="input w-full text-sm disabled:opacity-50 cursor-pointer"
          defaultValue="Armada Truk Berpendingin (Cold Chain)"
        >
          <option value="Armada Truk Berpendingin (Cold Chain)">
            Armada Truk Berpendingin (Cold Chain - Rekomendasi Jamur Segar &amp; Beku)
          </option>
          <option value="Kargo Logistik Kering (Kaleng &amp; Pouch)">
            Kargo Logistik Kering (Khusus Kaleng &amp; Pouch Steril)
          </option>
          <option value="Ambil Mandiri di Pabrik (Purwodadi, Pasuruan)">
            Ambil Mandiri di Gudang Pabrik (Purwodadi, Pasuruan)
          </option>
        </select>
      </div>

      <div>
        <label className="font-semibold text-charcoal mb-1.5 flex items-center gap-1.5 text-xs uppercase tracking-wider" htmlFor="shippingAddress">
          <MapPin className="w-4 h-4 text-charcoal-muted" />
          <span>Alamat Pengiriman Tujuan</span>
        </label>
        <textarea
          id="shippingAddress"
          name="shippingAddress"
          required
          defaultValue={defaultAddress}
          rows={3}
          disabled={isPending}
          className="input w-full resize-none text-sm disabled:opacity-50"
          placeholder="Alamat lengkap tujuan kirim..."
        />
      </div>

      <div>
        <label className="font-semibold text-charcoal mb-1.5 flex items-center gap-1.5 text-xs uppercase tracking-wider" htmlFor="notes">
          <MessageSquare className="w-4 h-4 text-charcoal-muted" />
          <span>Catatan Khusus (Opsional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          disabled={isPending}
          className="input w-full resize-none text-sm disabled:opacity-50"
          placeholder="Contoh: Titip di pos satpam / hubungi penerima..."
        />
      </div>
      
      <Button type="submit" variant="primary" disabled={isPending} className="w-full py-3 mt-4">
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
      </Button>
    </form>
  );
}
