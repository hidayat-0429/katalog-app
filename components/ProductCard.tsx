import Link from "next/link";
import Image from "next/image";
import { formatRupiah } from "@/lib/format";
import { getProductPlaceholderImage, getMinOrderText } from "@/lib/productImage";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  unit: string;
  stock: number;
  imageUrl: string | null;
  categoryName: string;
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
  const isOutOfStock = stock === 0;
  const displayImage = imageUrl || getProductPlaceholderImage(name, categoryName);
  const minOrder = getMinOrderText(unit);

  return (
    <Link
      href={`/produk/${id}`}
      aria-label={`Detail produk ${name}`}
      className="group flex flex-col bg-white dark:bg-dark-surface border border-border dark:border-dark-border rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-sage dark:hover:border-dark-sage"
    >
      {/* Product Image */}
      <div className="relative aspect-[4/3] w-full bg-bg-subtle dark:bg-dark-bg-subtle overflow-hidden border-b border-border dark:border-dark-border">
        <Image
          src={displayImage}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Category Pill Tag on Top-Left */}
        <div className="absolute top-2.5 left-2.5">
          <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 bg-black/65 backdrop-blur-xs text-white rounded-md shadow-xs">
            {categoryName}
          </span>
        </div>

        {isOutOfStock ? (
          <div className="absolute inset-0 bg-white/75 dark:bg-black/70 flex items-center justify-center backdrop-blur-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-300 px-3 py-1 bg-red-50 dark:bg-red-950/80 rounded-md border border-red-200 dark:border-red-900/50 shadow-xs">
              Stok Habis
            </span>
          </div>
        ) : (
          <div className="absolute bottom-2 right-2">
            <span className="text-[10px] font-medium px-2 py-0.5 bg-white/90 dark:bg-dark-surface/90 text-charcoal dark:text-dark-text rounded border border-border/80 dark:border-dark-border/80 shadow-2xs">
              Stok: {stock} {unit}
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-charcoal dark:text-dark-text leading-snug line-clamp-2 group-hover:text-sage dark:group-hover:text-dark-sage transition-colors">
            {name}
          </h3>
        </div>

        <div className="pt-2.5 border-t border-border-subtle dark:border-dark-border/60 flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-extrabold text-charcoal dark:text-dark-text">
                {formatRupiah(price)}
              </span>
              <span className="text-xs text-charcoal-muted dark:text-dark-muted font-normal">
                /{unit}
              </span>
            </div>
            <p className="text-[11px] text-sage dark:text-dark-sage font-medium mt-0.5">
              {minOrder}
            </p>
          </div>

          <span className="btn-primary text-xs py-1 px-2.5 rounded-md">
            Pesan
          </span>
        </div>
      </div>
    </Link>
  );
}
