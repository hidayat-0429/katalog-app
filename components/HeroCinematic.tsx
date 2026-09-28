"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, PackageSearch, Clock, Medal } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";

interface StatItem {
  value: string;
  numericValue: number;
  suffix: string;
  label: string;
  icon: React.ElementType;
}

function AnimatedCounter({
  target,
  suffix,
  isVisible,
}: {
  target: number;
  suffix: string;
  isVisible: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    let frame: number;
    const duration = 1600;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isVisible, target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

interface HeroCinematicProps {
  title?: string;
  subtitle?: string;
  description?: string;
  cta1Text?: string;
  cta2Text?: string;
}

export default function HeroCinematic({
  title = "Jamur Premium",
  subtitle = "untuk Dapur Profesional",
  description = "Partner terpercaya 500+ restoran premium di Indonesia. Dari jamur segar grade A hingga olahan siap pakai dipanen pagi, tiba same-day dengan cold chain berstandar internasional.",
  cta1Text = "Lihat Katalog Produk",
  cta2Text = "Hubungi Kami"
}: HeroCinematicProps = {}) {
  const t = useTranslations();

  const STATS: StatItem[] = [
    { value: "500", numericValue: 500, suffix: "+", label: t.hero.statPartners, icon: Building2 },
    { value: "50", numericValue: 50, suffix: t.hero.statTon, label: t.hero.statCapacity, icon: PackageSearch },
    { value: "24", numericValue: 24, suffix: t.hero.statHour, label: t.hero.statFreshness, icon: Clock },
    { value: "25", numericValue: 25, suffix: t.hero.statYear, label: t.hero.statExperience, icon: Medal },
  ];

  const heroRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);

  const handleScroll = useCallback(() => {
    if (!imageRef.current || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const scrolled = -rect.top * 0.12;
    imageRef.current.style.transform = `translateY(${scrolled}px) scale(1.02)`;
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (!statsRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setHeroLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[92vh] sm:min-h-screen flex items-start overflow-hidden"
    >
      {/* Background image with parallax */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          ref={imageRef}
          className="absolute inset-[-6%] transition-transform duration-75 ease-linear will-change-transform"
          style={{ transform: "translateY(0) scale(1.02)" }}
        >
          <Image
            src="/og-image.webp"
            alt={t.hero.imageAlt}
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Scrim horizontal: kolom teks ada di kiri, jadi sisi kanan yang boleh lebih terang */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />

        {/* Fade ke halaman di bawah — setinggi padding bawah konten agar tidak menimpa statistik */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-bg to-transparent" />
      </div>

      {/* Content — pt kecil karena spacer 56px di layout sudah menutup bar mobile (bar fixed, bg opaque) */}
      <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16 pt-6 sm:pt-10 lg:pt-12 pb-20 sm:pb-24">
        <div className="max-w-xl">

          {/* Logo + Nama brand */}
          <div
            className={`flex items-center gap-3 mb-3 hero-stagger ${heroLoaded ? "hero-stagger-visible" : ""}`}
            style={{ transitionDelay: "0ms" }}
          >
            <div className="relative w-14 h-14">
              <Image
                src="/logos/etira-product-logo.png"
                alt="Etira Logo"
                fill
                className="object-contain drop-shadow-md"
                sizes="56px"
              />
            </div>
            <div className="h-4 w-px bg-white/25" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75">
              PT Eka Timur Raya
            </span>
          </div>

          {/* Status dengan certification badge */}
          <div
            className={`flex items-center gap-2 mb-4 hero-stagger ${heroLoaded ? "hero-stagger-visible" : ""}`}
            style={{ transitionDelay: "80ms" }}
          >
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-forest-300 opacity-40" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-forest-300" />
            </span>
            <span className="text-xs font-medium text-white/75 tracking-wide">
              {t.hero.statusBadge}
            </span>
          </div>

          {/* Headline — hierarki dari ukuran & bobot, hijau berperan sebagai aksen grafis */}
          <h1
            className={`font-heading font-bold leading-[1.1] tracking-tight hero-stagger ${heroLoaded ? "hero-stagger-visible" : ""}`}
            style={{ transitionDelay: "160ms" }}
          >
            <span className="block text-[2.6rem] sm:text-5xl lg:text-[3.5rem] text-white">
              {title}
            </span>
            <span className="block text-[1.7rem] sm:text-3xl lg:text-[2.1rem] font-semibold text-white">
              {subtitle}
            </span>
          </h1>

          <div
            className={`h-1 w-14 rounded-full bg-brand-forest-300 mt-5 mb-6 hero-stagger ${heroLoaded ? "hero-stagger-visible" : ""}`}
            style={{ transitionDelay: "210ms" }}
          />

          {/* Deskripsi - Stronger value prop */}
          <p
            className={`text-sm sm:text-base text-white/80 leading-relaxed max-w-lg mb-8 hero-stagger ${heroLoaded ? "hero-stagger-visible" : ""}`}
            style={{ transitionDelay: "260ms" }}
          >
            {description}
          </p>

          {/* CTA */}
          <div
            className={`flex flex-wrap gap-3 mb-12 hero-stagger ${heroLoaded ? "hero-stagger-visible" : ""}`}
            style={{ transitionDelay: "360ms" }}
          >
            <Link
              href="/?katalog=semua"
              className="group inline-flex items-center gap-2 bg-brand-forest-600 hover:bg-brand-forest-500 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-brand-forest-900/40"
            >
              {cta1Text}
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/kontak"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/25 hover:border-white/45 hover:bg-white/15 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
            >
              {cta2Text}
            </Link>
          </div>

          {/* Stats */}
          <div
            ref={statsRef}
            className={`grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-white/10 hero-stagger ${heroLoaded ? "hero-stagger-visible" : ""}`}
            style={{ transitionDelay: "500ms" }}
          >
            {STATS.slice(0, 3).map((item, idx) => (
              <div key={item.label} className="group">
                <item.icon className="w-4 h-4 text-brand-forest-300 mb-2 opacity-80 group-hover:opacity-100 transition-opacity duration-200" />
                <p className="font-mono text-xl sm:text-2xl font-bold text-white tracking-tight">
                  <AnimatedCounter
                    target={item.numericValue}
                    suffix={item.suffix}
                    isVisible={statsVisible}
                  />
                </p>
                <p className="text-[11px] text-white/75 mt-0.5 font-medium leading-snug">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hero-stagger ${heroLoaded ? "hero-stagger-visible" : ""}`}
        style={{ transitionDelay: "900ms" }}
      >
        <div className="w-5 h-8 rounded-full border border-white/10 flex justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-white/20 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
