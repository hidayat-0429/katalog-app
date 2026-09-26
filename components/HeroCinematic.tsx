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
    const scrolled = -rect.top * 0.25;
    imageRef.current.style.transform = `translateY(${scrolled}px) scale(1.06)`;
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
      className="relative min-h-[92vh] sm:min-h-screen flex items-center overflow-hidden"
    >
      {/* Background image with parallax */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          ref={imageRef}
          className="absolute inset-[-6%] transition-transform duration-75 ease-linear will-change-transform"
          style={{ transform: "translateY(0) scale(1.06)" }}
        >
          <Image
            src="/og-image.png"
            alt={t.hero.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Gradasi lebih ringan foto masih terlihat di sisi kanan */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1a10]/90 via-[#0d1a10]/60 to-[#0d1a10]/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a10]/55 via-transparent to-transparent" />



        {/* Fade ke halaman di bawah */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#faf9f6] dark:from-[#0f1110] to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16 pt-8 sm:pt-12 pb-20 sm:pb-28">
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
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
              PT Eka Timur Raya
            </span>
          </div>

          {/* Status dengan certification badge */}
          <div
            className={`flex items-center gap-2 mb-4 hero-stagger ${heroLoaded ? "hero-stagger-visible" : ""}`}
            style={{ transitionDelay: "80ms" }}
          >
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-fresh-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-fresh-400" />
            </span>
            <span className="text-xs font-medium text-white/50 tracking-wide">
              {t.hero.statusBadge}
            </span>
          </div>

          {/* Headline - Premium positioning */}
          <h1
            className={`font-heading font-bold leading-[1.1] tracking-tight mb-5 hero-stagger ${heroLoaded ? "hero-stagger-visible" : ""}`}
            style={{ transitionDelay: "160ms" }}
          >
            <span className="block text-[2.6rem] sm:text-5xl lg:text-[3.5rem] text-white">
              {title}
            </span>
            <span className="block text-[2.6rem] sm:text-5xl lg:text-[3.5rem] text-brand-fresh-300">
              {subtitle}
            </span>
          </h1>

          {/* Deskripsi - Stronger value prop */}
          <p
            className={`text-sm sm:text-base text-white/65 leading-relaxed max-w-lg mb-8 hero-stagger ${heroLoaded ? "hero-stagger-visible" : ""}`}
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
              className="inline-flex items-center gap-2 bg-white/8 backdrop-blur-sm border border-white/20 hover:border-white/40 hover:bg-white/14 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
            >
              {cta2Text}
            </Link>
          </div>

          {/* Stats */}
          <div
            ref={statsRef}
            className={`grid grid-cols-2 sm:grid-cols-4 gap-5 pt-6 border-t border-white/10 hero-stagger ${heroLoaded ? "hero-stagger-visible" : ""}`}
            style={{ transitionDelay: "500ms" }}
          >
            {STATS.map((item) => (
              <div key={item.label} className="group">
                <item.icon className="w-4 h-4 text-white/50 mb-2 opacity-70 group-hover:opacity-100 transition-opacity duration-200" />
                <p className="font-mono text-xl sm:text-2xl font-bold text-white tracking-tight">
                  <AnimatedCounter
                    target={item.numericValue}
                    suffix={item.suffix}
                    isVisible={statsVisible}
                  />
                </p>
                <p className="text-[11px] text-white/40 mt-0.5 font-medium leading-snug">
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
        <div className="w-5 h-8 rounded-full border border-white/15 flex justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-white/30 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
