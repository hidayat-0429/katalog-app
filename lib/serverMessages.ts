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
 * tidak punya akses localStorage. Pengunjung baru (belum ada cookie) dapat Inggris;
 * pilihan manual selalu menang karena di-cookie.
 */
export async function getServerLocale(): Promise<ServerLocale> {
  const store = await cookies();
  return store.get('locale')?.value === 'id' ? 'id' : 'en';
}

export async function getServerMessages() {
  return (await getServerLocale()) === 'en' ? enMessages : idMessages;
}
