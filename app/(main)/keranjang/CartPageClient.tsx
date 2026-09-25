'use client';

import Link from 'next/link';
import { ShoppingCart, Receipt } from 'lucide-react';
import CartItemRow from './CartItemRow';
import CheckoutForm from './CheckoutForm';
import { formatRupiah } from '@/lib/format';
import EmptyState from '@/components/EmptyState';
import { useTranslations } from '@/hooks/useTranslations';

interface CartItem {
  id: string;
  product: {
    name: string;
    price: number;
    unit: string;
    stock: number;
    imageUrl: string | null;
  };
  quantity: number;
}

interface CartPageClientProps {
  cartItems: CartItem[];
  defaultAddress: string;
}

export default function CartPageClient({ cartItems, defaultAddress }: CartPageClientProps) {
  const t = useTranslations();

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return (
    <div className="py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {t.cart.title}
        </h1>
        <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          {t.cart.subtitle}
        </p>
      </div>

      {cartItems.length === 0 ? (
        <EmptyState
          icon={<ShoppingCart className="w-8 h-8" />}
          title={t.cart.empty}
          description={t.cart.emptyDescription}
          action={{ label: t.nav.cart, href: "/?katalog=semua" }}
        />
      ) : (
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Daftar item */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            {/* Header kolom CartItemRow menggunakan flex bukan grid */}

            {cartItems.map((item) => (
              <CartItemRow
                key={item.id}
                cartId={item.id}
                name={item.product.name}
                price={item.product.price}
                unit={item.product.unit}
                quantity={item.quantity}
                stock={item.product.stock}
                imageUrl={item.product.imageUrl}
              />
            ))}

            <div className="mt-2">
              <Link
                href="/?katalog=semua"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-forest-600 dark:text-brand-forest-400 hover:underline transition-colors duration-150 ease-out"
              >
                {t.cart.continueShopping}
              </Link>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <div className="bg-white dark:bg-[#141715] border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden">
              {/* Header */}
              <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                <span className="font-heading font-bold text-sm text-neutral-900 dark:text-neutral-100">{t.cart.summary}</span>
              </div>

              {/* Rincian */}
              <div className="px-5 py-4 space-y-3 border-b border-neutral-200 dark:border-neutral-700">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-500 dark:text-neutral-400">{t.cart.totalItems}</span>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">{totalItems} {t.cart.unit}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{t.cart.totalPrice}</span>
                  <span className="font-mono text-xl font-bold text-neutral-900 dark:text-neutral-100">{formatRupiah(totalPrice)}</span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-3 leading-relaxed">
                  {t.cart.shippingNote}
                </p>
              </div>

              {/* Form checkout */}
              <div className="p-5">
                <CheckoutForm defaultAddress={defaultAddress} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
