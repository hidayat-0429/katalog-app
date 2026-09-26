'use client';

import { Building2, Target, ShieldCheck, MapPin, CalendarDays, Users2, Package } from "lucide-react";
import Image from "next/image";
import { useTranslations } from '@/hooks/useTranslations';

export default function TentangPageClient() {
  const t = useTranslations();

  return (
    <div className="py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {t.tentang.title}
        </h1>
        <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          {t.tentang.subtitle}
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 bg-white dark:bg-[#141715] border border-neutral-200 dark:border-neutral-700 rounded-xl mb-8">
        {[
          { value: "1999", label: t.tentang.founded, icon: CalendarDays },
          { value: "500+", label: t.tentang.partners, icon: Users2 },
          { value: "50+ Ton", label: t.tentang.capacity, icon: Package },
          { value: "HACCP & Halal", label: t.tentang.standards, icon: ShieldCheck },
        ].map(({ value, label, icon: Icon }) => (
          <div key={label} className="flex flex-col items-center text-center gap-1">
            <div className="w-8 h-8 rounded-lg bg-brand-forest-50 dark:bg-brand-forest-950/40 border border-brand-forest-200 dark:border-brand-forest-800 flex items-center justify-center text-brand-forest-600 dark:text-brand-forest-400 mb-1">
              <Icon className="w-4 h-4" />
            </div>
            <p className="font-mono text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100">{value}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Profil Perusahaan */}
      <section className="mb-10">
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {/* Left: Image */}
          <div className="relative aspect-[16/10] md:aspect-auto w-full min-h-[260px] md:min-h-full rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700">
            <Image 
              src="/etira.png" 
              alt={t.tentang.facilityAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute bottom-3 left-3 right-3 bg-neutral-900/80 backdrop-blur-xs text-white p-3 rounded-lg border border-white/10 text-xs">
              <p className="font-semibold text-white">{t.tentang.facilities}</p>
              <p className="text-white/80 text-[11px] mt-0.5">{t.tentang.locationTitle} - {t.about.location}</p>
            </div>
          </div>

          {/* Right: Content */}
          <div className="bg-white dark:bg-[#141715] border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-md bg-brand-forest-50 dark:bg-brand-forest-950/40 border border-brand-forest-200 dark:border-brand-forest-800 flex items-center justify-center text-brand-forest-600 dark:text-brand-forest-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-forest-600 dark:text-brand-forest-400">
                  {t.tentang.history}
                </span>
              </div>
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-neutral-900 dark:text-neutral-100 mb-3">
                {t.tentang.producerTitle}
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-3">
                {t.tentang.historyDescription1}
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {t.tentang.historyDescription2}
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="inline-flex items-center gap-1.5 font-medium text-brand-forest-700 dark:text-brand-forest-400">
                <ShieldCheck className="w-4 h-4" /> {t.tentang.standardized}
              </span>
              <span>•</span>
              <span>{t.tentang.exportStandard}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="mb-10">
        <div className="mb-4">
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-neutral-900 dark:text-neutral-100">
            {t.tentang.visionMission}
          </h2>
          <p className="font-sans text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            {t.tentang.visionMissionSubtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {/* Card Visi */}
          <div className="bg-white dark:bg-[#141715] border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-brand-forest-50 dark:bg-brand-forest-950/40 border border-brand-forest-200 dark:border-brand-forest-800 flex items-center justify-center text-brand-forest-600 dark:text-brand-forest-400">
                  <Target className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-forest-600 dark:text-brand-forest-400">
                  {t.tentang.visionTitle}
                </span>
              </div>
              <blockquote className="font-heading text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 leading-snug mb-4">
                &ldquo;{t.tentang.visionText}&rdquo;
              </blockquote>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                {t.tentang.visionDescription}
              </p>
            </div>
            <ul className="space-y-2 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-300">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-forest-600 dark:bg-brand-forest-400 mt-1.5 shrink-0" />
                <span>{t.tentang.visionBullet1}</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-forest-600 dark:bg-brand-forest-400 mt-1.5 shrink-0" />
                <span>{t.tentang.visionBullet2}</span>
              </li>
            </ul>
          </div>

          {/* Card Misi */}
          <div className="bg-white dark:bg-[#141715] border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-brand-forest-50 dark:bg-brand-forest-950/40 border border-brand-forest-200 dark:border-brand-forest-800 flex items-center justify-center text-brand-forest-600 dark:text-brand-forest-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-forest-600 dark:text-brand-forest-400">
                  {t.tentang.missionTitle}
                </span>
              </div>
              <blockquote className="font-heading text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 leading-snug mb-4">
                &ldquo;{t.tentang.missionText}&rdquo;
              </blockquote>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                {t.tentang.missionDescription}
              </p>
            </div>
            <ul className="space-y-2 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-300">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-forest-600 dark:bg-brand-forest-400 mt-1.5 shrink-0" />
                <span>{t.tentang.missionBullet1}</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-forest-600 dark:bg-brand-forest-400 mt-1.5 shrink-0" />
                <span>{t.tentang.missionBullet2}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Keunggulan */}
      <section className="mb-10">
        <div className="mb-4">
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-neutral-900 dark:text-neutral-100">
            {t.tentang.advantages}
          </h2>
          <p className="font-sans text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            {t.tentang.advantagesSubtitle}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#141715] border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-brand-forest-50 dark:bg-brand-forest-950/40 border border-brand-forest-200 dark:border-brand-forest-800 flex items-center justify-center text-brand-forest-600 dark:text-brand-forest-400 mb-3">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-sm text-neutral-900 dark:text-neutral-100 mb-1.5">
              {t.tentang.advantage1}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {t.tentang.advantage1Desc}
            </p>
          </div>

          <div className="bg-white dark:bg-[#141715] border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-brand-forest-50 dark:bg-brand-forest-950/40 border border-brand-forest-200 dark:border-brand-forest-800 flex items-center justify-center text-brand-forest-600 dark:text-brand-forest-400 mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-sm text-neutral-900 dark:text-neutral-100 mb-1.5">
              {t.tentang.advantage2}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {t.tentang.advantage2Desc}
            </p>
          </div>

          <div className="bg-white dark:bg-[#141715] border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-brand-forest-50 dark:bg-brand-forest-950/40 border border-brand-forest-200 dark:border-brand-forest-800 flex items-center justify-center text-brand-forest-600 dark:text-brand-forest-400 mb-3">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-sm text-neutral-900 dark:text-neutral-100 mb-1.5">
              {t.tentang.advantage3}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {t.tentang.advantage3Desc}
            </p>
          </div>

          <div className="bg-white dark:bg-[#141715] border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-brand-forest-50 dark:bg-brand-forest-950/40 border border-brand-forest-200 dark:border-brand-forest-800 flex items-center justify-center text-brand-forest-600 dark:text-brand-forest-400 mb-3">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-sm text-neutral-900 dark:text-neutral-100 mb-1.5">
              {t.tentang.advantage4}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {t.tentang.advantage4Desc}
            </p>
          </div>
        </div>
      </section>

      {/* Fasilitas & Lokasi */}
      <section>
        <div className="mb-4">
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-neutral-900 dark:text-neutral-100">
            {t.tentang.facilities}
          </h2>
          <p className="font-sans text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            {t.tentang.facilitiesSubtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {/* Lini Fasilitas (2 cols) */}
          <div className="md:col-span-2 bg-white dark:bg-[#141715] border border-neutral-200 dark:border-neutral-700 rounded-xl p-6">
            <h3 className="font-heading font-bold text-base text-neutral-900 dark:text-neutral-100 mb-3">
              {t.tentang.facilitiesTitle}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-5">
              {t.tentang.facilitiesIntro}
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
                <p className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 mb-1">
                  {t.tentang.facilityBudidaya}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {t.tentang.facilityBudidayaDesc}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
                <p className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 mb-1">
                  {t.tentang.facilityKaleng}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {t.tentang.facilityKalengDesc}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
                <p className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 mb-1">
                  {t.tentang.facilityColdStorage}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {t.tentang.facilityColdStorageDesc}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
                <p className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 mb-1">
                  {t.tentang.facilityOlahan}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {t.tentang.facilityOlahanDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Lokasi Card (1 col) */}
          <div className="bg-white dark:bg-[#141715] border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-brand-forest-50 dark:bg-brand-forest-950/40 border border-brand-forest-200 dark:border-brand-forest-800 flex items-center justify-center text-brand-forest-600 dark:text-brand-forest-400 mb-3">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-forest-600 dark:text-brand-forest-400">
                {t.tentang.location}
              </span>
              <h3 className="font-heading font-bold text-base text-neutral-900 dark:text-neutral-100 mt-1 mb-2">
                {t.tentang.locationTitle}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                {t.tentang.locationAddress}
              </p>
            </div>
            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">{t.tentang.distanceSurabaya}</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">{t.tentang.distanceSurabayaValue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">{t.tentang.coverage}</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">{t.tentang.coverageValue}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
