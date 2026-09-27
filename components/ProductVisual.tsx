'use client';

import Image from 'next/image';
import { Boxes, ChefHat, Leaf, Package, Snowflake, Sprout } from 'lucide-react';

type Kind = 'frozen' | 'canned' | 'pouch' | 'processed' | 'fresh' | 'default';

// Produk tanpa foto masih harus kelihatan disengaja, bukan seperti gambar yang gagal
// dimuat. Kata kunci dicocokkan dalam dua bahasa karena nama produk Indonesia dan
// Inggris dipakai bergantian.
const KINDS: { kind: Kind; words: string[]; icon: typeof Leaf; tone: string }[] = [
  { kind: 'frozen', words: ['beku', 'frozen', 'iqf'], icon: Snowflake, tone: 'from-sky-100 to-stone-100 text-sky-800/25' },
  { kind: 'canned', words: ['kaleng', 'canned', 'can '], icon: Package, tone: 'from-amber-100 to-stone-100 text-amber-800/25' },
  { kind: 'pouch', words: ['pouch', 'retort', 'sachet'], icon: Boxes, tone: 'from-orange-100 to-stone-100 text-orange-800/25' },
  { kind: 'processed', words: ['nugget', 'bakso', 'olahan', 'processed', 'kopiah'], icon: ChefHat, tone: 'from-rose-100 to-stone-100 text-rose-800/25' },
  { kind: 'fresh', words: ['segar', 'fresh'], icon: Leaf, tone: 'from-emerald-100 to-stone-100 text-emerald-800/25' },
  { kind: 'default', words: [], icon: Sprout, tone: 'from-stone-100 to-neutral-200 text-stone-600/25' },
];

function kindOf(name: string, categoryName?: string | null): (typeof KINDS)[number] {
  const haystack = `${name || ''} ${categoryName || ''}`.toLowerCase();
  return KINDS.find((k) => k.words.some((w) => haystack.includes(w))) ?? KINDS[KINDS.length - 1];
}

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

  const match = kindOf(name, categoryName);
  const Icon = match.icon;

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${match.tone} dark:from-neutral-800 dark:to-neutral-900`}
    >
      <div className="absolute inset-0 opacity-[0.07] dark:opacity-[0.12]">
        <div className="h-full w-full [background-image:repeating-linear-gradient(135deg,transparent_0_13px,currentColor_13px_14px)]" />
      </div>
      <Icon className="relative w-1/3 h-1/3 max-w-24 max-h-24" strokeWidth={1.25} />
    </div>
  );
}
