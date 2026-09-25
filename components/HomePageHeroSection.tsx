'use client';

import { useTranslations } from '@/hooks/useTranslations';
import HeroCinematic from '@/components/HeroCinematic';
import TrustBanner from '@/components/TrustBanner';
import FeaturesGrid from '@/components/FeaturesGrid';
import ScrollReveal from '@/components/ScrollReveal';

export default function HomePageHeroSection() {
  const t = useTranslations();

  return (
    <>
      {/* 1. HERO Cinematic scroll parallax */}
      <HeroCinematic />

      {/* Shimmer divider */}
      <div className="shimmer-line mx-auto max-w-4xl" />

      {/* 2. TRUST BANNER - Client logos & Certifications */}
      <ScrollReveal>
        <TrustBanner />
      </ScrollReveal>

      {/* 3. FEATURES GRID - B2B Highlights */}
      <ScrollReveal>
        <FeaturesGrid />
      </ScrollReveal>
    </>
  );
}
