'use client';

import Image from 'next/image';
import { Boxes, ChefHat, Leaf, Package, Snowflake, Sprout } from 'lucide-react';

// Produk tanpa foto masih harus kelihatan disengaja, bukan seperti gambar yang gagal
// dimuat. Kata kunci dicocokkan dalam dua bahasa karena nama produk Indonesia dan
// Inggris dipakai bergantian.
const KINDS: { words: string[]; icon: typeof Leaf }[] = [
  { words: ['beku', 'frozen', 'iqf'], icon: Snowflake },
  { words: ['kaleng', 'canned', 'can '], icon: Package },
  { words: ['pouch', 'retort', 'sachet'], icon: Boxes },
  { words: ['nugget', 'bakso', 'olahan', 'processed', 'kopiah'], icon: ChefHat },
  { words: ['segar', 'fresh'], icon: Leaf },
];

const FALLBACK_ICON = Sprout;

// Banyak baris produk masih menyimpan gambar contoh di kolom imageUrl. Selama belum
// diganti foto asli lewat admin, lebih baik ditampilkan panel komoditas yang jelas
// disengaja daripada satu foto yang sama di semua kartu.
const PLACEHOLDER_ASSETS = ['/hero-branding.jpg', '/og-image.png', '/etira.png'];

function hasRealPhoto(imageUrl: string | null) {
  if (!imageUrl) return false;
  const path = imageUrl.split('?')[0];
  return !PLACEHOLDER_ASSETS.some((asset) => path.endsWith(asset));
}

interface ProductVisualProps {
  imageUrl: string | null;
  name: string;
  categoryName?: string | null;
  sizes: string;
  priority?: boolean;
}

export default function ProductVisual({
  imageUrl,
  name,
  categoryName,
  sizes,
  priority,
}: ProductVisualProps) {
  if (hasRealPhoto(imageUrl)) {
    return (
      <Image
        src={imageUrl as string}
        alt={name}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover object-center"
      />
    );
  }

  const haystack = `${name || ''} ${categoryName || ''}`.toLowerCase();
  const Icon = KINDS.find((k) => k.words.some((w) => haystack.includes(w)))?.icon ?? FALLBACK_ICON;

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center bg-bg-subtle border border-border-subtle"
    >
      <Icon className="w-1/3 h-1/3 max-w-24 max-h-24 text-charcoal-muted" strokeWidth={1.25} />
    </div>
  );
}
