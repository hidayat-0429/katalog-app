/**
 * Provides curated, reliable, and high-quality food & product images
 * as fallbacks when a product doesn't have an uploaded image yet.
 */
export function getProductPlaceholderImage(name: string, categoryName?: string | null): string {
  const query = `${name || ''} ${categoryName || ''}`.toLowerCase();

  // All products use local image
  return '/hero-branding.jpg';
}

/**
 * Returns Minimum Order Quantity (MOQ) text based on product unit
 */
export function getMinOrderText(
  unit: string,
  t?: { moqCans: string; moqPouches: string; moqPacks: string; moqKg: string; moqPrefix: string }
): string {
  const u = (unit || '').toLowerCase();
  if (u.includes('kaleng')) return t?.moqCans ?? 'Min. order 24 kaleng (1 karton)';
  if (u.includes('pouch')) return t?.moqPouches ?? 'Min. order 20 pouch (1 dus)';
  if (u.includes('pack')) return t?.moqPacks ?? 'Min. order 10 pack (1 karton)';
  if (u.includes('kg')) return t?.moqKg ?? 'Min. order 10 kg';
  return `${t?.moqPrefix ?? 'Min. order'} 12 ${unit || 'unit'}`;
}

import { formatText } from '@/lib/productText';

/**
 * Kalkulasi konversi satuan ecer ke kemasan grosir (Karton / Dus)
 */
export interface CartonTexts {
  karton: string;
  dus: string;
  full: string;
  fullRemaining: string;
  below: string;
}

const CARTON_TEXTS_ID: CartonTexts = {
  karton: 'Karton',
  dus: 'Dus',
  full: '≈ {count} {carton} Pas',
  fullRemaining: '≈ {count} {carton} + {remaining} {unit}',
  below: '{quantity} {unit} (Isi 1 {carton} = {perCarton} {unit})',
};

export function getCartonConversion(unit: string, quantity: number, texts?: Partial<CartonTexts>) {
  const t = { ...CARTON_TEXTS_ID, ...texts };
  const u = (unit || '').toLowerCase();
  let perCarton = 24;
  let isDus = false;

  if (u.includes('kaleng')) {
    perCarton = 24;
  } else if (u.includes('pouch')) {
    perCarton = 20;
    isDus = true;
  } else if (u.includes('pack')) {
    perCarton = 12;
  } else if (u.includes('keranjang') || u.includes('karton')) {
    perCarton = 1;
  }

  const cartonName = isDus ? t.dus : t.karton;
  const cartons = Math.floor(quantity / perCarton);
  const remaining = quantity % perCarton;

  return {
    perCarton,
    cartonName,
    cartons,
    remaining,
    text: cartons > 0
      ? formatText(remaining > 0 ? t.fullRemaining : t.full, { count: cartons, carton: cartonName, remaining, unit })
      : formatText(t.below, { quantity, unit, carton: cartonName, perCarton }),
  };
}

