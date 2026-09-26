export const SHIPPING_METHODS = [
  { value: 'Armada Truk Berpendingin (Cold Chain)', labelKey: 'coldChain' },
  { value: 'Kargo Logistik Kering (Kaleng & Pouch)', labelKey: 'dryFleet' },
  { value: 'Ambil Mandiri di Pabrik (Purwodadi, Pasuruan)', labelKey: 'selfPickup' },
] as const;

export type FleetLabelKey = (typeof SHIPPING_METHODS)[number]['labelKey'];

export function fleetLabelKey(value: string): FleetLabelKey | null {
  return SHIPPING_METHODS.find((m) => m.value === value)?.labelKey ?? null;
}

/**
 * checkout() menyimpan metode pengiriman di dalam kolom notes sebagai
 * "[Armada: <nilai>] - Catatan: <teks bebas>", jadi diurai sebelum ditampilkan.
 */
export function parseOrderNotes(notes: string | null): { fleetValue: string | null; comment: string | null } {
  if (!notes) return { fleetValue: null, comment: null };

  const match = notes.match(/^\[Armada: ([\s\S]*?)\](?: - Catatan: ([\s\S]*))?$/);
  if (!match) return { fleetValue: null, comment: notes };

  return {
    fleetValue: match[1] || null,
    comment: match[2]?.trim() ? match[2].trim() : null,
  };
}
