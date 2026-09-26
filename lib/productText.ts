type LocalizableProduct = {
  name: string;
  nameEn?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
};

// Versi bahasa Inggris jatuh kembali ke teks Indonesia bila kolom opsionalnya masih kosong.
export function localizeProduct<T extends LocalizableProduct>(product: T, locale: string) {
  const useEn = locale === 'en';
  return {
    name: useEn && product.nameEn?.trim() ? product.nameEn : product.name,
    description: useEn && product.descriptionEn?.trim() ? product.descriptionEn : product.description,
  };
}
