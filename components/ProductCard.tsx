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
      className="group flex flex-col bg-white dark:bg-[#141715] border border-stone-200 dark:border-stone-800/90 rounded-lg overflow-hidden transition-all duration-200 hover:border-stone-400 dark:hover:border-stone-500 hover:shadow-xs"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden">
        <Image
          src={displayImage}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
        />

        {/* Stock Notice if out of stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1 rounded-sm bg-stone-900/90 text-white text-xs font-medium">
              Stok Habis
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400 dark:text-stone-500 block mb-1">
            {categoryName}
          </span>
          <h3 className="font-sans font-semibold text-base text-[#1f2421] dark:text-stone-100 leading-snug line-clamp-2 group-hover:text-[#1b382b] dark:text-emerald-400 transition-colors">
            {name}
          </h3>
          <p className="font-sans text-xs text-stone-500 dark:text-stone-400 dark:text-stone-500 mt-1">
            {minOrder}
          </p>
        </div>

        <div className="pt-3.5 border-t border-stone-100 dark:border-stone-800/60 flex items-end justify-between gap-2">
          <div>
            <span className="text-[10px] text-stone-400 dark:text-stone-500 uppercase tracking-wider block font-medium">
              Harga pasokan
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-sans text-base sm:text-lg font-bold text-[#1f2421] dark:text-stone-100 tracking-tight">
                {formatRupiah(price)}
              </span>
              <span className="font-sans text-xs text-stone-500 dark:text-stone-400 dark:text-stone-500">
                /{unit}
              </span>
            </div>
          </div>

          <span className="text-xs font-semibold text-[#1b382b] dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 pb-0.5 shrink-0 whitespace-nowrap">
            Lihat Detail &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
