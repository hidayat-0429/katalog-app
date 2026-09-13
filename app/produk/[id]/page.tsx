import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ChevronRight, Info } from 'lucide-react';
import { getCurrentUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { formatRupiah } from '@/lib/format';
import AddToCartForm from './AddToCartForm';
import { getProductPlaceholderImage, getMinOrderText } from '@/lib/productImage';

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const user = await getCurrentUser();
  const { id } = params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) {
    notFound();
  }

  const displayImage = product.imageUrl || getProductPlaceholderImage(product.name, product.category?.name);
  const minOrder = getMinOrderText(product.unit);

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-8">
      {/* Clean Sentence Case Breadcrumbs */}
      <nav className="flex items-center gap-1.5 font-sans text-xs text-charcoal-muted mb-8 overflow-x-auto pb-1">
        <Link href="/" className="hover:text-charcoal transition-colors">
          Katalog
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link
          href={`/?kategori=${product.categoryId}#katalog`}
          className="hover:text-charcoal transition-colors"
        >
          {product.category?.name || 'Kategori'}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-charcoal font-medium truncate">
          {product.name}
        </span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Left: Product Image */}
        <div className="relative aspect-square bg-bg-subtle rounded-xl overflow-hidden">
          <Image 
            src={displayImage} 
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        {/* Right: Info & Order Box */}
        <div className="flex flex-col">
          <div className="mb-8 border-b border-border pb-6">
            <span className="font-sans text-sm font-medium text-charcoal-muted block mb-2">
              {product.category?.name || 'Produk Pangan'}
            </span>
            
            <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-charcoal mb-4 leading-snug">
              {product.name}
            </h1>
            
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-3xl sm:text-4xl font-bold text-charcoal">
                  {formatRupiah(product.price)}
                </span>
                <span className="font-sans text-base text-charcoal-muted font-normal">
                  /{product.unit}
                </span>
              </div>
              <p className="font-sans text-sm text-charcoal-muted mt-2">
                {minOrder}
              </p>
            </div>
          </div>

          {/* Product Description */}
          <div className="mb-8">
            <p className="font-sans text-base text-charcoal leading-relaxed whitespace-pre-line mb-6">
              {product.description || 'Produk pangan bermutu tinggi yang diproses dengan standar kebersihan terjaga, siap untuk kebutuhan dapur usaha dan industri kuliner.'}
            </p>
            
            <div className="flex items-center gap-3 font-sans text-sm text-charcoal">
              <Package className="w-5 h-5 text-charcoal-muted shrink-0" />
              <span>
                Status persediaan: <strong className="font-semibold">{product.stock > 0 ? `Tersedia ${product.stock} ${product.unit}` : 'Habis'}</strong>
              </span>
            </div>
          </div>

          {/* Order Action Area */}
          <div className="pt-6 border-t border-border">
            {!user ? (
              <div className="bg-bg-subtle p-5 rounded-lg text-center font-sans text-sm">
                <p className="text-charcoal-muted mb-4">
                  Silakan masuk untuk melakukan pemesanan produk ini.
                </p>
                <Link href="/login" className="btn-primary w-full justify-center py-3">
                  Masuk ke Akun
                </Link>
              </div>
            ) : user.role === 'ADMIN' ? (
              <div className="flex items-center gap-3 bg-bg-subtle text-charcoal-muted p-5 rounded-lg font-sans text-sm">
                <Info className="w-5 h-5 shrink-0 text-charcoal" />
                <span>Akun Admin sedang aktif. Gunakan akun Pembeli untuk memesan produk.</span>
              </div>
            ) : product.stock === 0 ? (
              <button disabled className="btn-secondary w-full opacity-50 cursor-not-allowed py-3 font-sans text-sm font-medium">
                Persediaan Habis
              </button>
            ) : (
              <div className="bg-surface border border-border p-5 rounded-lg">
                <AddToCartForm productId={product.id} maxStock={product.stock} unit={product.unit} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
