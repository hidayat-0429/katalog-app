type LocalizableProduct = {
  name: string;
  nameEn?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
};

export function formatText(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => (key in values ? String(values[key]) : `{${key}}`));
}

// Versi bahasa Inggris jatuh kembali ke teks Indonesia bila kolom opsionalnya masih kosong.
export function localizeName(item: { name: string; nameEn?: string | null }, locale: string): string {
  return locale === 'en' && item.nameEn?.trim() ? item.nameEn : item.name;
}

export function localizeProduct<T extends LocalizableProduct>(product: T, locale: string) {
  const useEn = locale === 'en';
  return {
    name: localizeName(product, locale),
    description: useEn && product.descriptionEn?.trim() ? product.descriptionEn : product.description,
  };
}
