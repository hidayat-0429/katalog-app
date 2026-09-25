'use client';

import HeroCinematic from '@/components/HeroCinematic';
import { useTranslations } from '@/hooks/useTranslations';

export default function HeroCinematicWrapper() {
  const t = useTranslations();
  
  return (
    <HeroCinematic
      title={t.hero.title}
      subtitle={t.hero.subtitle}
      description={t.hero.description}
      cta1Text={t.hero.cta1}
      cta2Text={t.hero.cta2}
    />
  );
}
