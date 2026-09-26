import { cookies } from 'next/headers';
import idMessages from '@/messages/id.json';
import enMessages from '@/messages/en.json';

/**
 * Server action tidak punya akses localStorage, jadi baca locale dari cookie
 * yang ditulis LocaleProvider. Hanya dipakai untuk pesan yang dilihat pembeli;
 * teks khusus admin tetap Indonesia.
 */
export async function getServerMessages() {
  const store = await cookies();
  return store.get('locale')?.value === 'en' ? enMessages : idMessages;
}
