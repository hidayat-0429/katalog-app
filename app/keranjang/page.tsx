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
    <div className="max-w-5xl mx-auto py-4">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-charcoal">Keranjang Belanja</h1>
          <p className="font-sans text-xs sm:text-sm text-charcoal-muted mt-0.5">
            Periksa rincian jumlah barang sebelum membuat pesanan resmi
          </p>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <EmptyState 
          icon={<ShoppingCart className="w-8 h-8" />}
          title="Keranjang masih kosong"
          description="Pilih produk dari katalog untuk mulai memesan pasokan pangan."
          action={{ label: "Buka Katalog", href: "/#katalog" }}
        />
      ) : (
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 flex flex-col gap-3">
            {cartItems.map((item) => (
              <CartItemRow 
                key={item.id}
                cartId={item.id}
                name={item.product.name}
                price={item.product.price}
                unit={item.product.unit}
                quantity={item.quantity}
                stock={item.product.stock}
              />
            ))}
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-20">
            <div className="card p-5">
              <div className="flex items-center gap-2 font-sans font-bold text-sm text-charcoal pb-3 border-b border-border">
                <Receipt className="w-4 h-4 text-charcoal-muted" />
                <span>Ringkasan Pemesanan</span>
              </div>
              
              <div className="py-4 border-b border-border space-y-2.5 font-sans text-sm">
                <div className="flex justify-between text-charcoal-muted">
                  <span>Jumlah Item</span>
                  <span className="font-semibold text-charcoal">{totalItems} unit</span>
                </div>
                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-charcoal font-medium">Total Harga</span>
                  <span className="font-mono text-xl font-bold text-charcoal">{formatRupiah(totalPrice)}</span>
                </div>
              </div>

              <CheckoutForm defaultAddress={dbUser?.address || ''} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
