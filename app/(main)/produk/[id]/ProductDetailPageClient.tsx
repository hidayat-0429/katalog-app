'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ChevronRight, Info } from 'lucide-react';
import { formatRupiah } from '@/lib/format';
import AddToCartForm from './AddToCartForm';
import { getProductPlaceholderImage, getMinOrderText } from '@/lib/productImage';
import { useTranslations } from '@/hooks/useTranslations';
import { Product, Category } from '@prisma/client';

interface ProductDetailPageClientProps {
  product: Product & { category: Category | null };
  user: any;
}

export default function ProductDetailPageClient({ product, user }: ProductDetailPageClientProps) {
  const t = useTranslations();

  if (!product || !product.isActive) {
    notFound();
  }

  const displayImage = product.imageUrl || getProductPlaceholderImage(product.name, product.category?.name);
  const minOrder = getMinOrderText(product.unit);

  return (
    <div className="w-full px-6 sm:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto py-4 sm:py-6">
        {/* Clean Sentence Case Breadcrumbs */}
        <nav className="flex items-center gap-1.5 font-sans text-xs text-neutral-500 dark:text-neutral-400 mb-6 overflow-x-auto pb-1">
          <Link href="/" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-150 ease-out">
            {t.productDetail.breadcrumb.home}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link href="/?katalog=semua" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-150 ease-out">
            {t.productDetail.breadcrumb.catalog}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link
            href={`/?katalog=semua&kategori=${product.categoryId}`}
            className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-150 ease-out"
          >
            {product.category?.name || t.productDetail.breadcrumb.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-neutral-900 dark:text-neutral-100 font-medium truncate">
            {product.name}
          </span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: Product Image - Sticky */}
          <div>
            <div className="relative aspect-[4/3] sm:aspect-square bg-neutral-50 dark:bg-neutral-800/50 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 sticky top-20">
              <Image 
                src={displayImage} 
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right: Product Info & Order */}
          <div className="flex flex-col">
            <div className="mb-6">
              <span className="font-sans text-xs font-semibold uppercase tracking-wider text-brand-forest-600 dark:text-brand-forest-400 block mb-2">
                {product.category?.name || 'Produk Pangan'}
              </span>
              
              <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-4 leading-snug">
                {product.name}
              </h1>
              
              <div className="pt-2 mb-6">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100">
                    {formatRupiah(product.price)}
                  </span>
                  <span className="font-sans text-sm text-neutral-500 dark:text-neutral-400 font-normal">
                    /{product.unit}
                  </span>
                </div>
                <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  {minOrder}
                </p>
              </div>

              {/* Short Description */}
              <p className="font-sans text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                {product.description || 'Produk pangan bermutu tinggi siap untuk kebutuhan dapur usaha dan industri kuliner.'}
              </p>

              {/* Stock Status */}
              <div className="flex items-center gap-2 font-sans text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                <Package className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                <span>
                  {t.product.stock}: <strong className="text-neutral-900 dark:text-neutral-100">{product.stock > 0 ? `Tersedia ${product.stock} ${product.unit}` : 'Habis'}</strong>
                </span>
              </div>

              {/* Certifications & Freshness */}
              <div className="space-y-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                {/* Freshness Badge */}
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-brand-forest-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-forest-500" />
                  </span>
                  <span className="font-sans text-xs font-semibold text-brand-forest-700 dark:text-brand-forest-300">{t.productDetail.freshHarvest}</span>
                </div>

                {/* Certifications Row */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-forest-50 dark:bg-brand-forest-900/30 border border-brand-forest-200 dark:border-brand-forest-800 rounded-full text-[11px] font-semibold text-brand-forest-700 dark:text-brand-forest-300">
                    {t.productDetail.certHaccp}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-forest-50 dark:bg-brand-forest-900/30 border border-brand-forest-200 dark:border-brand-forest-800 rounded-full text-[11px] font-semibold text-brand-forest-700 dark:text-brand-forest-300">
                    {t.productDetail.certHalal}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-full text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                    {t.productDetail.certOem}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Action Area */}
            <div className="space-y-4">
              {!user ? (
                <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 text-center font-sans text-xs sm:text-sm">
                  <p className="text-neutral-500 dark:text-neutral-400 mb-3">
                    {t.productDetail.login}
                  </p>
                  <Link href="/login" className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-brand-forest-600 hover:bg-brand-forest-700 text-white text-sm font-semibold transition-colors duration-150">
                    {t.productDetail.loginButton}
                  </Link>
                </div>
              ) : user.role === 'ADMIN' ? (
                <div className="flex items-center gap-2.5 bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 font-sans text-xs">
                  <Info className="w-4 h-4 shrink-0 text-neutral-700 dark:text-neutral-300" />
                  <span>{t.productDetail.adminNote}</span>
                </div>
              ) : product.stock === 0 ? (
                <button disabled className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm font-semibold opacity-50 cursor-not-allowed">
                  {t.productDetail.outOfStock}
                </button>
              ) : (
                <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4">
                  <AddToCartForm productId={product.id} maxStock={product.stock} unit={product.unit} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Info Section */}
        <div className="mt-12 pt-12 border-t border-neutral-200 dark:border-neutral-700">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Penyimpanan */}
            <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
              <h3 className="font-heading font-bold text-sm text-neutral-900 dark:text-neutral-100 mb-3">{t.productDetail.storage}</h3>
              <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                <li>• {t.productDetail.storageItems.temp}</li>
                <li>• {t.productDetail.storageItems.shelf}</li>
                <li>• {t.productDetail.storageItems.avoid}</li>
                <li>• {t.productDetail.storageItems.wash}</li>
              </ul>
            </div>

            {/* Kegunaan */}
            <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
              <h3 className="font-heading font-bold text-sm text-neutral-900 dark:text-neutral-100 mb-3">{t.productDetail.suitable}</h3>
              <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                <li>• {t.productDetail.suitableItems.cooking}</li>
                <li>• {t.productDetail.suitableItems.pizza}</li>
                <li>• {t.productDetail.suitableItems.oriental}</li>
                <li>• {t.productDetail.suitableItems.diet}</li>
              </ul>
            </div>

            {/* Keuntungan Bulk */}
            <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
              <h3 className="font-heading font-bold text-sm text-neutral-900 dark:text-neutral-100 mb-3">{t.productDetail.bulkAdvantage}</h3>
              <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                <li>{t.productDetail.bulkItems.price}</li>
                <li>{t.productDetail.bulkItems.shipping}</li>
                <li>{t.productDetail.bulkItems.support}</li>
                <li>{t.productDetail.bulkItems.quality}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
