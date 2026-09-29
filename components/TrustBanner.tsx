"use client";

import { ShieldCheck, Users, Hotel, Utensils, ChefHat, Factory, Store, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";

export default function TrustBanner() {
  const t = useTranslations();

  const segments: { name: string; note: string; icon: LucideIcon }[] = [
    { name: t.trustBanner.segments.hotel, note: t.trustBanner.segments.hotelNote, icon: Hotel },
    { name: t.trustBanner.segments.restaurant, note: t.trustBanner.segments.restaurantNote, icon: Utensils },
    { name: t.trustBanner.segments.catering, note: t.trustBanner.segments.cateringNote, icon: ChefHat },
    { name: t.trustBanner.segments.industry, note: t.trustBanner.segments.industryNote, icon: Factory },
    { name: t.trustBanner.segments.retail, note: t.trustBanner.segments.retailNote, icon: Store },
    { name: t.trustBanner.segments.distributor, note: t.trustBanner.segments.distributorNote, icon: Truck },
  ];

  const commitments = [
    { name: t.trustBanner.chipHalal, color: "bg-brand-forest-100 dark:bg-brand-forest-900/30 text-brand-forest-700 dark:text-brand-forest-300 border-brand-forest-200 dark:border-brand-forest-800" },
    { name: t.trustBanner.chipSafe, color: "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700" },
  ];

  return (
    <section className="w-full px-6 sm:px-8 lg:px-16 py-12 sm:py-16 bg-surface border-y border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-brand-forest-600 dark:text-brand-forest-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-muted">
              {t.trustBanner.eyebrow}
            </span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            {t.trustBanner.title}
          </h2>
        </div>

        {/* Customer Segments Grid */}
        <div className="mb-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {segments.map(({ name, note, icon: Icon }) => (
              <div
                key={name}
                className="flex flex-col items-center justify-center p-5 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-brand-forest-300 dark:hover:border-brand-forest-600 transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-brand-forest-100 dark:bg-brand-forest-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-brand-forest-600 dark:text-brand-forest-400" />
                </div>
                <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 text-center">
                  {name}
                </p>
                <p className="text-xs text-charcoal-muted text-center mt-0.5">
                  {note}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Commitment */}
        <div className="flex flex-col items-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-brand-forest-600 dark:text-brand-forest-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">
              {t.trustBanner.certLabel}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {commitments.map((chip) => (
              <div
                key={chip.name}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-bold ${chip.color}`}
              >
                <ShieldCheck className="w-4 h-4" />
                {chip.name}
              </div>
            ))}
          </div>
          <p className="text-xs text-charcoal-muted mt-4 text-center max-w-2xl">
            {t.trustBanner.certText}
          </p>
        </div>

      </div>
    </section>
  );
}
