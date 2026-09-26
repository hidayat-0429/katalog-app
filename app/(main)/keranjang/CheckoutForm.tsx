'use client';

import { useState, useTransition } from 'react';
import { ShoppingBag, MapPin, MessageSquare, AlertCircle, Loader2, Truck, Check, X } from 'lucide-react';
import { checkout } from '@/lib/actions/cart';
import { Button } from '@/components/ui';
import { useTranslations } from '@/hooks/useTranslations';
// Nilai option disimpan apa adanya ke kolom notes pesanan, jadi hanya labelnya yang diterjemahkan.
import { SHIPPING_METHODS } from '@/lib/orderNotes';

interface CheckoutFormProps {
  defaultAddress?: string;
}

interface OrderSummary {
  shippingMethod: string;
  shippingAddress: string;
  notes: string;
}

export default function CheckoutForm({ defaultAddress = '' }: CheckoutFormProps) {
  const t = useTranslations();
  const tc = t.checkout;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);

  const methodLabel = (value: string) => {
    const found = SHIPPING_METHODS.find((m) => m.value === value);
    return found ? t.fleet[found.labelKey] : value;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.currentTarget);
    const shippingMethod = String(formData.get('shippingMethod') || '');
    const shippingAddress = String(formData.get('shippingAddress') || '');
    const notes = String(formData.get('notes') || '');

    if (!shippingAddress.trim()) {
      setError(tc.addressRequired);
      return;
    }

    setOrderSummary({
      shippingMethod,
      shippingAddress,
      notes,
    });
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    if (!orderSummary) return;

    const formData = new FormData();
    formData.append('shippingMethod', orderSummary.shippingMethod);
    formData.append('shippingAddress', orderSummary.shippingAddress);
    formData.append('notes', orderSummary.notes);

    startTransition(async () => {
      try {
        const res = await checkout(formData);
        if (res?.error) {
          setError(res.error);
          setShowConfirmation(false);
        }
      } catch (err: any) {
        if (err?.message?.includes('NEXT_REDIRECT')) {
          throw err;
        }
        setError(err?.message || 'Terjadi kesalahan saat memproses pesanan');
        setShowConfirmation(false);
      }
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="text-sm text-semantic-danger-dark bg-semantic-danger-light p-3 rounded-md border border-semantic-danger-DEFAULT flex items-start gap-2 dark:bg-semantic-danger-darkBg dark:text-red-200 dark:border-red-900">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs uppercase tracking-wide font-medium text-neutral-700 dark:text-neutral-300 mb-2 flex items-center gap-2" htmlFor="shippingMethod">
            <Truck className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            <span>{tc.methodLabel}</span>
          </label>
          <select
            id="shippingMethod"
            name="shippingMethod"
            disabled={isPending || showConfirmation}
            className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-base focus:outline-none focus:ring-2 focus:ring-brand-forest-500 focus:border-brand-forest-500 transition-colors duration-150 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
            defaultValue={SHIPPING_METHODS[0].value}
          >
            {SHIPPING_METHODS.map((method) => (
              <option key={method.value} value={method.value}>
                {t.fleet[method.labelKey]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wide font-medium text-neutral-700 dark:text-neutral-300 mb-2 flex items-center gap-2" htmlFor="shippingAddress">
            <MapPin className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            <span>{tc.addressLabel}</span>
          </label>
          <textarea
            id="shippingAddress"
            name="shippingAddress"
            required
            defaultValue={defaultAddress}
            rows={3}
            disabled={isPending || showConfirmation}
            className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-base focus:outline-none focus:ring-2 focus:ring-brand-forest-500 focus:border-brand-forest-500 transition-colors duration-150 ease-out placeholder:text-neutral-400 dark:placeholder:text-neutral-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder={tc.addressPlaceholder}
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wide font-medium text-neutral-700 dark:text-neutral-300 mb-2 flex items-center gap-2" htmlFor="notes">
            <MessageSquare className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            <span>{tc.notesLabel}</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={2}
            disabled={isPending || showConfirmation}
            className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-base focus:outline-none focus:ring-2 focus:ring-brand-forest-500 focus:border-brand-forest-500 transition-colors duration-150 ease-out placeholder:text-neutral-400 dark:placeholder:text-neutral-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder={tc.notesPlaceholder}
          />
        </div>
        
        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <Button type="submit" variant="primary" disabled={isPending || showConfirmation} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{tc.processing}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>{tc.reviewButton}</span>
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirmation && orderSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 max-w-md w-full shadow-lg">
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-forest-100 dark:bg-brand-forest-900/30 flex items-center justify-center">
                <Check className="w-5 h-5 text-brand-forest-600 dark:text-brand-forest-400" />
              </div>
              <h2 className="font-heading font-bold text-lg text-neutral-900 dark:text-neutral-100">
                {tc.confirmTitle}
              </h2>
            </div>

            {/* Content */}
            <div className="px-6 py-4 space-y-4">
              <div className="bg-neutral-50 dark:bg-neutral-700/30 border border-neutral-200 dark:border-neutral-600 rounded-lg p-4">
                <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-3 font-semibold">{tc.summaryLabel}</p>
                <div className="space-y-2.5 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase text-neutral-600 dark:text-neutral-400 mb-1">{tc.method}</p>
                    <p className="text-neutral-900 dark:text-neutral-100 font-medium">{methodLabel(orderSummary.shippingMethod)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-neutral-600 dark:text-neutral-400 mb-1">{tc.address}</p>
                    <p className="text-neutral-900 dark:text-neutral-100 whitespace-pre-wrap">{orderSummary.shippingAddress}</p>
                  </div>
                  {orderSummary.notes && (
                    <div>
                      <p className="text-xs font-semibold uppercase text-neutral-600 dark:text-neutral-400 mb-1">{tc.notes}</p>
                      <p className="text-neutral-900 dark:text-neutral-100 italic">{orderSummary.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {tc.afterConfirmNote}
              </p>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-700 flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                disabled={isPending}
                className="flex-1 px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 font-semibold text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                <span>{tc.editButton}</span>
              </button>
              <button
                onClick={handleConfirm}
                disabled={isPending}
                className="flex-1 px-4 py-2.5 rounded-lg bg-brand-forest-600 hover:bg-brand-forest-700 text-white font-semibold text-sm transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{tc.processingShort}</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{tc.confirmButton}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
