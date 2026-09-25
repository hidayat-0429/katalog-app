import { cookies } from 'next/headers';
import idMessages from '@/messages/id.json';
import enMessages from '@/messages/en.json';

export type Messages = typeof idMessages;

// Default to Indonesian for server-side
export async function getServerMessages(locale?: string): Promise<Messages> {
  const targetLocale = locale || 'id';
  return targetLocale === 'en' ? enMessages : idMessages;
}

