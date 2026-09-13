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
      className="group flex flex-col bg-surface border border-border rounded-lg overflow-hidden transition-colors hover:border-primary"
    >
      {/* Product Image */}
      <div className="relative aspect-[4/3] w-full bg-bg-subtle overflow-hidden border-b border-border">
        <Image
          src={displayImage}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />

        {/* Category Pill Tag on Top-Left */}
        <div className="absolute top-2.5 left-2.5">
          <span className="font-sans text-[10px] font-semibold tracking-wide uppercase px-2 py-1 bg-charcoal/80 text-white rounded-md shadow-xs">
            {categoryName}
          </span>
        </div>

        {isOutOfStock ? (
          <div className="absolute inset-0 bg-white/60 dark:bg-black/60 flex items-center justify-center backdrop-blur-xs">
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-danger px-3 py-1 bg-danger-bg rounded-md border border-danger shadow-xs">
              Stok Habis
            </span>
          </div>
        ) : (
          <div className="absolute bottom-2.5 right-2.5">
            <span className="font-sans text-[10px] font-medium px-2 py-1 bg-surface text-charcoal rounded-md border border-border shadow-xs">
              Stok: <span className="font-mono">{stock}</span> {unit}
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <h3 className="font-sans font-semibold text-sm sm:text-base text-charcoal leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {name}
          </h3>
        </div>

        <div className="pt-3 border-t border-border flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-base sm:text-lg font-bold text-charcoal">
                {formatRupiah(price)}
              </span>
              <span className="font-sans text-xs text-charcoal-muted">
                /{unit}
              </span>
            </div>
            <p className="font-sans text-[11px] text-charcoal-muted mt-0.5">
              {minOrder}
            </p>
          </div>

          <span className="btn-primary text-xs py-1.5 px-3 rounded-md">
            Pesan
          </span>
        </div>
      </div>
    </Link>
  );
}
