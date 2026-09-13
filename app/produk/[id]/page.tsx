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
    <div className="max-w-5xl mx-auto py-4 sm:py-6">
      {/* Clean Sentence Case Breadcrumbs */}
      <nav className="flex items-center gap-1.5 font-sans text-xs text-charcoal-muted mb-6 overflow-x-auto pb-1">
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

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left: Product Image */}
        <div className="relative aspect-[4/3] sm:aspect-square bg-bg-subtle rounded-lg overflow-hidden border border-border">
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
          <div className="mb-6">
            <span className="font-sans text-xs font-semibold uppercase tracking-wider text-primary block mb-1.5">
              {product.category?.name || 'Produk Pangan'}
            </span>
            
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-charcoal mb-3 leading-snug">
              {product.name}
            </h1>
            
            <div className="pt-2">
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-2xl sm:text-3xl font-bold text-charcoal">
                  {formatRupiah(product.price)}
                </span>
                <span className="font-sans text-sm text-charcoal-muted font-normal">
                  /{product.unit}
                </span>
              </div>
              <p className="font-sans text-xs text-charcoal-muted mt-1">
                {minOrder}
              </p>
            </div>
          </div>

          {/* Product Description */}
          <div className="card p-5 mb-6">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-charcoal-muted mb-2">
              Spesifikasi &amp; Deskripsi
            </h3>
            <p className="font-sans text-sm text-charcoal leading-relaxed whitespace-pre-line mb-4">
              {product.description || 'Produk pangan bermutu tinggi yang diproses dengan standar kebersihan terjaga, siap untuk kebutuhan dapur usaha dan industri kuliner.'}
            </p>
            
            <div className="pt-3 border-t border-border flex items-center gap-2.5 font-sans text-xs text-charcoal-muted">
              <Package className="w-4 h-4 text-charcoal shrink-0" />
              <span>
                Status persediaan: <strong className="text-charcoal font-semibold">{product.stock > 0 ? `Tersedia ${product.stock} ${product.unit}` : 'Habis'}</strong>
              </span>
            </div>
          </div>

          {/* Order Action Area */}
          <div>
            {!user ? (
              <div className="bg-bg-subtle border border-border rounded-lg p-4 text-center font-sans text-xs sm:text-sm">
                <p className="text-charcoal-muted mb-3">
                  Silakan masuk untuk melakukan pemesanan produk ini.
                </p>
                <Link href="/login" className="btn-primary w-full justify-center">
                  Masuk ke Akun
                </Link>
              </div>
            ) : user.role === 'ADMIN' ? (
              <div className="flex items-center gap-2.5 bg-bg-subtle text-charcoal-muted p-4 rounded-lg border border-border font-sans text-xs">
                <Info className="w-4 h-4 shrink-0 text-charcoal" />
                <span>Akun Admin sedang aktif. Gunakan akun Pembeli untuk memesan produk.</span>
              </div>
            ) : product.stock === 0 ? (
              <button disabled className="btn-secondary w-full opacity-50 cursor-not-allowed py-2.5 font-sans text-xs font-medium">
                Persediaan Habis
              </button>
            ) : (
              <div className="card p-4">
                <AddToCartForm productId={product.id} maxStock={product.stock} unit={product.unit} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
