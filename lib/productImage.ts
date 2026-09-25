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
export function getMinOrderText(unit: string): string {
  const u = (unit || '').toLowerCase();
  if (u.includes('kaleng')) return 'Min. order 24 kaleng (1 karton)';
  if (u.includes('pouch')) return 'Min. order 20 pouch (1 dus)';
  if (u.includes('pack')) return 'Min. order 10 pack (1 karton)';
  if (u.includes('kg')) return 'Min. order 10 kg';
  return `Min. order 12 ${unit || 'unit'}`;
}

/**
 * Kalkulasi konversi satuan ecer ke kemasan grosir (Karton / Dus)
 */
export function getCartonConversion(unit: string, quantity: number) {
  const u = (unit || '').toLowerCase();
  let perCarton = 24;
  let cartonName = 'Karton';

  if (u.includes('kaleng')) {
    perCarton = 24;
    cartonName = 'Karton';
  } else if (u.includes('pouch')) {
    perCarton = 20;
    cartonName = 'Dus';
  } else if (u.includes('pack')) {
    perCarton = 12;
    cartonName = 'Karton';
  } else if (u.includes('keranjang') || u.includes('karton')) {
    perCarton = 1;
    cartonName = 'Karton';
  }

  const cartons = Math.floor(quantity / perCarton);
  const remaining = quantity % perCarton;

  return {
    perCarton,
    cartonName,
    cartons,
    remaining,
    text: cartons > 0 
      ? `≈ ${cartons} ${cartonName}${remaining > 0 ? ` + ${remaining} ${unit}` : ' Pas'}`
      : `${quantity} ${unit} (Isi 1 ${cartonName} = ${perCarton} ${unit})`,
  };
}

