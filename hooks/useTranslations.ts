'use client';

import { useLocale } from '@/components/LocaleProvider';
import idMessages from '@/messages/id.json';
import enMessages from '@/messages/en.json';

export function useTranslations() {
  const locale = useLocale();
  return locale === 'en' ? enMessages : idMessages;
}
