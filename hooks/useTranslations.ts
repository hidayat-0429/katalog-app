'use client';

import { useLocale } from '@/components/LocaleProvider';
import idMessages from '@/messages/id.json';
import enMessages from '@/messages/en.json';

export function useTranslations() {
  const locale = useLocale();
  const messages = locale === 'en' ? enMessages : idMessages;
  return messages;
}
