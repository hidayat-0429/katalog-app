"use client";

import Link from "next/link";
import { ChefHat } from "lucide-react";
import ProductVisual from "@/components/ProductVisual";
import { localizeName } from "@/lib/productText";
import { useLocale } from "@/components/LocaleProvider";
import { useTranslations } from "@/hooks/useTranslations";

// Smart context mapping based on product name
function getUsageContext(
  productName: string,
  categoryName: string,
  t: ReturnType<typeof useTranslations>
): string | null {
  const name = productName.toLowerCase();
  const category = categoryName.toLowerCase();

  // Context mapping based on mushroom type
  if (name.includes('shiitake')) return t.productCard.usageShiitake;
  if (name.includes('champignon') || name.includes('button')) return t.productCard.usageChampignon;
  if (name.includes('oyster') || name.includes('tiram')) return t.productCard.usageOyster;
  if (name.includes('enoki')) return t.productCard.usageEnoki;
  if (name.includes('shimeji')) return t.productCard.usageShimeji;
  if (name.includes('portobello')) return t.productCard.usagePortobello;

  // Context based on product type
  if (name.includes('kaleng') || name.includes('canned')) return t.productCard.usageCanned;
  if (name.includes('beku') || name.includes('frozen')) return t.productCard.usageFrozen;
  if (name.includes('pouch')) return t.productCard.usagePouch;
  if (name.includes('nugget') || name.includes('bakso')) return t.productCard.usageSnack;

  // Default by category
  if (category.includes('olahan')) return t.productCard.usageProcessed;
  if (category.includes('segar')) return t.productCard.usageFresh;

  return null;
}


interface ProductCardProps {
  id: string;
  name: string;
  unit: string;
  stock: number;
  imageUrl: string | null;
  categoryName: string;
  categoryNameEn?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  priority?: boolean;
}

export default function ProductCard({
  id,
  name,
  unit,
  stock,
  imageUrl,
  categoryName,
  categoryNameEn,
  priority,
}: ProductCardProps) {
  const t = useTranslations();
  const locale = useLocale();
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 10;
  const usageContext = getUsageContext(name, categoryName, t);
  const displayCategory = localizeName({ name: categoryName, nameEn: categoryNameEn }, locale);

  return (
    <Link
      href={`/produk/${id}`}
      aria-label={`${t.productCard.detailLabel} ${name}`}
      className="group flex flex-col bg-surface border border-neutral-300 dark:border-neutral-700 rounded-xl overflow-hidden motion-safe:transition-all motion-safe:duration-200 hover:border-brand-forest-500 dark:hover:border-brand-forest-500 hover:shadow-md"
    >
      {/* Image Container */}
      {/* Bingkai foto sengaja lebih gelap dari kartu (dan dari `bg` halaman): foto produk
          resmi berbentuk potongan dengan latar transparan, jadi warna inilah yang mengisi
          ruang kosong di sekitar kemasan. Samakan dengan kotak foto di ProductSkeleton. */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-200 dark:bg-neutral-900">
        <div className="motion-safe:transition-transform motion-safe:duration-300 group-hover:scale-105 absolute inset-0">
          <ProductVisual
            imageUrl={imageUrl}
            name={name}
            categoryName={categoryName}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
          />
        </div>

        {/* Top-left: Category Badge */}
        <div className="absolute top-2.5 left-2.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white/90 dark:bg-neutral-900/90 text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-700/80 backdrop-blur-xs shadow-xs">
            {displayCategory}
          </span>
        </div>

        {/* Top-right: Stock Status */}
        <div className="absolute top-2.5 right-2.5">
          {isOutOfStock ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-neutral-900/90 text-white border border-neutral-700 shadow-xs">
              {t.productCard.outOfStock}
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-semantic-warning-light dark:bg-semantic-warning-darkBg text-semantic-warning-dark dark:text-semantic-warning-200 border border-semantic-warning-DEFAULT dark:border-semantic-warning-700 shadow-xs">
              {`${t.productCard.remainingPrefix} ${stock} ${unit} ${t.productCard.remainingSuffix}`.trim()}
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-charcoal-muted border border-neutral-200 dark:border-neutral-700 shadow-xs">
              {t.productCard.available}
            </span>
          )}
        </div>

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-neutral-900/60 flex items-center justify-center backdrop-blur-xs">
            <span className="px-3 py-1.5 rounded-lg bg-neutral-900/90 text-white text-xs font-semibold tracking-wide border border-white/20">
              {t.productCard.soldOutOverlay}
            </span>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="font-heading font-bold text-base text-neutral-900 dark:text-neutral-100 leading-snug group-hover:text-brand-forest-600 dark:group-hover:text-brand-forest-400 transition-colors line-clamp-1">
          {name}
        </h3>

        {/* Usage Context Badge - NEW */}
        {usageContext && (
          <div className="flex items-center gap-1.5 text-xs">
            <ChefHat className="w-3.5 h-3.5 text-brand-forest-600 dark:text-brand-forest-400 flex-shrink-0" />
            <span className="text-charcoal-muted italic">{usageContext}</span>
          </div>
        )}

        <p className="font-sans text-xs text-charcoal-muted">
          {t.productCard.wholesaleNote}
        </p>

        {/* Pricing + Action */}
        <div className="mt-auto pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">
              {t.productCard.supplyPrice}
            </span>
            {/* Harga sengaja tidak dipajang: PT belum memberi angka grosir resmi dan katalog
                ini khusus penawaran via tim — angka karangan dilarang jadi janji publik. */}
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5 block">
              {t.productCard.priceOnRequest}
            </span>
          </div>

          <span className="px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-xs font-semibold text-charcoal-muted group-hover:bg-brand-forest-600 group-hover:text-white group-hover:border-brand-forest-600 transition-colors shrink-0">
            {t.productCard.order}
          </span>
        </div>
      </div>
    </Link>
  );
}
