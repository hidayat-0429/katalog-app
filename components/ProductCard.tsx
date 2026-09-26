"use client";

import Link from "next/link";
import Image from "next/image";
import { ChefHat } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import { getProductPlaceholderImage, getMinOrderText } from "@/lib/productImage";
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
  if (name.includes('shiitake')) return 'Perfect for Ramen & Asian Cuisine';
  if (name.includes('champignon') || name.includes('button')) return t.productCard.usageChampignon;
  if (name.includes('oyster') || name.includes('tiram')) return 'Best for Stir-fry & Soup';
  if (name.includes('enoki')) return 'Great for Hotpot & Salad';
  if (name.includes('shimeji')) return 'Premium Japanese Dishes';
  if (name.includes('portobello')) return 'Gourmet Steak & Burger';

  // Context based on product type
  if (name.includes('kaleng') || name.includes('canned')) return 'Ready-to-use, Long Shelf Life';
  if (name.includes('beku') || name.includes('frozen')) return 'Frozen Fresh, Easy Storage';
  if (name.includes('pouch')) return 'Convenient Portion Control';
  if (name.includes('nugget') || name.includes('bakso')) return 'Ready-to-fry Snack';

  // Default by category
  if (category.includes('olahan')) return t.productCard.usageProcessed;
  if (category.includes('segar')) return 'Fresh Daily Harvest';

  return null;
}


interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  unit: string;
  stock: number;
  imageUrl: string | null;
  categoryName: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export default function ProductCard({
  id,
  name,
  price,
  unit,
  stock,
  imageUrl,
  categoryName,
}: ProductCardProps) {
  const t = useTranslations();
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 10;
  const displayImage = imageUrl || getProductPlaceholderImage(name, categoryName);
  const minOrder = getMinOrderText(unit, t.productCard);
  const usageContext = getUsageContext(name, categoryName, t);

  return (
    <Link
      href={`/produk/${id}`}
      aria-label={`${t.productCard.detailLabel} ${name}`}
      className="group flex flex-col bg-white dark:bg-[#141715] border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden motion-safe:transition-all motion-safe:duration-200 hover:border-brand-forest-500 dark:hover:border-brand-forest-500 hover:shadow-md"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-50 dark:bg-neutral-900">
        <Image
          src={displayImage}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center motion-safe:transition-transform motion-safe:duration-300 group-hover:scale-105"
        />

        {/* Top-left: Category Badge */}
        <div className="absolute top-2.5 left-2.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white/90 dark:bg-neutral-900/90 text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-700/80 backdrop-blur-xs shadow-xs">
            {categoryName}
          </span>
        </div>

        {/* Top-right: Stock Status */}
        <div className="absolute top-2.5 right-2.5">
          {isOutOfStock ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-neutral-900/90 text-white border border-neutral-700 shadow-xs">
              {t.productCard.outOfStock}
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-brand-earth-50 dark:bg-brand-earth-950/60 text-brand-earth-700 dark:text-brand-earth-300 border border-brand-earth-200 dark:border-brand-earth-800 shadow-xs">
              {`${t.productCard.remainingPrefix} ${stock} ${unit} ${t.productCard.remainingSuffix}`.trim()}
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 shadow-xs">
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
            <ChefHat className="w-3.5 h-3.5 text-brand-amber-600 dark:text-brand-amber-400 flex-shrink-0" />
            <span className="text-neutral-600 dark:text-neutral-400 italic">{usageContext}</span>
          </div>
        )}

        <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400">
          {minOrder}
        </p>

        {/* Pricing + Action */}
        <div className="mt-auto pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block">
              {t.productCard.supplyPrice}
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-mono text-lg font-bold text-neutral-900 dark:text-neutral-100">
                {formatRupiah(price)}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">/{unit}</span>
            </div>
          </div>

          <span className="px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-xs font-semibold text-neutral-600 dark:text-neutral-300 group-hover:bg-brand-forest-600 group-hover:text-white group-hover:border-brand-forest-600 transition-colors shrink-0">
            {t.productCard.order}
          </span>
        </div>
      </div>
    </Link>
  );
}
