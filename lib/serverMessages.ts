import { cookies } from 'next/headers';
import idMessages from '@/messages/id.json';
import enMessages from '@/messages/en.json';

/**
 * Server action tidak punya akses localStorage, jadi baca locale dari cookie
 * yang ditulis LocaleProvider. Hanya dipakai untuk pesan yang dilihat pembeli;
 * teks khusus admin tetap Indonesia.
 */
export type ServerLocale = 'id' | 'en';

/**
 * Locale aktif dibaca dari cookie yang ditulis LocaleProvider, karena server
 * tidak punya akses localStorage.
 */
export async function getServerLocale(): Promise<ServerLocale> {
  const store = await cookies();
  return store.get('locale')?.value === 'en' ? 'en' : 'id';
}

export async function getServerMessages() {
  return (await getServerLocale()) === 'en' ? enMessages : idMessages;
}
