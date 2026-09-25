'use client';

import { useLocale } from '@/components/LocaleProvider';
import idMessages from '@/messages/id.json';
import enMessages from '@/messages/en.json';

export function useTranslations() {
  const locale = useLocale();
  const messages = locale === 'en' ? enMessages : idMessages;
  console.log('[useTranslations] Hook called, locale:', locale);
  return messages;
}
