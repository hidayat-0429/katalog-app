/**
 * Provides curated, reliable, and high-quality food & product images
 * as fallbacks when a product doesn't have an uploaded image yet.
 */
export function getProductPlaceholderImage(name: string, categoryName?: string | null): string {
  const query = `${name || ''} ${categoryName || ''}`.toLowerCase();

  // Kaleng / Canned button mushrooms
  if (query.includes('kaleng') || query.includes('can') || query.includes('2.8kg')) {
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';
  }

  // Pouch / sliced mushrooms
  if (query.includes('pouch') || query.includes('slice') || query.includes('iris')) {
    return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80';
  }

  // Nugget or processed items
  if (query.includes('nugget') || query.includes('camilan') || query.includes('goreng')) {
    return 'https://images.unsplash.com/photo-1562967914-608f82629710?w=800&auto=format&fit=crop&q=80';
  }

  // Frozen / fresh / raw mushrooms
  if (query.includes('beku') || query.includes('frozen')) {
    return 'https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?w=800&auto=format&fit=crop&q=80';
  }

  // Whole button / fresh mushroom default
  return 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&auto=format&fit=crop&q=80';
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

