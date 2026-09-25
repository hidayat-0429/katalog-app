import { requireUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ShoppingCart, Receipt } from 'lucide-react';
import CartItemRow from './CartItemRow';
import CheckoutForm from './CheckoutForm';
import { formatRupiah } from '@/lib/format';
import EmptyState from '@/components/EmptyState';

export default async function CartPage() {
  const user = await requireUser();

  const [cartItems, dbUser] = await Promise.all([
    prisma.cart.findMany({
      where: { userId: user.id },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.findUnique({
      where: { id: user.id },
      select: { address: true },
    }),
  ]);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return (
    <div className="py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Keranjang Belanja
        </h1>
        <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Periksa rincian jumlah barang sebelum membuat pesanan resmi
        </p>
      </div>

      {cartItems.length === 0 ? (
        <EmptyState
          icon={<ShoppingCart className="w-8 h-8" />}
          title="Keranjang masih kosong"
          description="Pilih produk dari katalog untuk mulai memesan pasokan pangan."
          action={{ label: "Buka Katalog", href: "/?katalog=semua" }}
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
                 Lanjut belanja
              </Link>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <div className="bg-white dark:bg-[#141715] border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden">
              {/* Header */}
              <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                <span className="font-heading font-bold text-sm text-neutral-900 dark:text-neutral-100">Ringkasan Pesanan</span>
              </div>

              {/* Rincian */}
              <div className="px-5 py-4 space-y-3 border-b border-neutral-200 dark:border-neutral-700">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-500 dark:text-neutral-400">Jumlah Item</span>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">{totalItems} unit</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Total Harga</span>
                  <span className="font-mono text-xl font-bold text-neutral-900 dark:text-neutral-100">{formatRupiah(totalPrice)}</span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-3 leading-relaxed">
                  Harga belum termasuk biaya pengiriman. Estimasi ongkos kirim akan dikonfirmasi oleh tim operasional.
                </p>
              </div>

              {/* Form checkout */}
              <div className="p-5">
                <CheckoutForm defaultAddress={dbUser?.address || ''} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
