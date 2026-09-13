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
      className="group flex flex-col transition-colors"
    >
      {/* Product Image */}
      <div className="relative aspect-square sm:aspect-[4/3] w-full bg-bg-subtle overflow-hidden rounded-lg mb-3">
        <Image
          src={displayImage}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center backdrop-blur-[2px]">
            <span className="font-sans text-xs font-bold tracking-widest uppercase text-charcoal px-3 py-1.5 bg-white rounded-full">
              Habis
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 gap-1">
        <span className="font-sans text-xs font-medium text-charcoal-muted">
          {categoryName}
        </span>
        
        <h3 className="font-sans text-base text-charcoal leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {name}
        </h3>

        <div className="mt-1">
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-lg font-bold text-charcoal">
              {formatRupiah(price)}
            </span>
            <span className="font-sans text-sm text-charcoal-muted">
              /{unit}
            </span>
          </div>
          <p className="font-sans text-xs text-charcoal-muted mt-0.5">
            {minOrder} • Stok {stock}
          </p>
        </div>
      </div>
    </Link>
  );
}
