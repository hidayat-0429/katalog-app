'use client';

import { ReactNode } from 'react';
import { useTranslations } from '@/hooks/useTranslations';

interface LocaleAwareWrapperProps {
  children: (translations: ReturnType<typeof useTranslations>) => ReactNode;
}

export function LocaleAwareWrapper({ children }: LocaleAwareWrapperProps) {
  const t = useTranslations();
  return <>{children(t)}</>;
}
