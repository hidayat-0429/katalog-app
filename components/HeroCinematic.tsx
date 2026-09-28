"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, PackageSearch, Clock, ShieldCheck } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";

interface StatItem {
  value: string;
  /** Diisi hanya untuk angka yang bisa dianimasikan; teks murni (mis. HACCP) lewat `value`. */
  numericValue?: number;
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
  title: string;
  subtitle: string;
  description: string;
  cta1Text: string;
  cta2Text: string;
}

export default function HeroCinematic({
  title,
  subtitle,
  description,
  cta1Text,
  cta2Text,
}: HeroCinematicProps) {
  const t = useTranslations();

  const STATS: StatItem[] = [
    { value: "500", numericValue: 500, suffix: "+", label: t.hero.statPartners, icon: Building2 },
    { value: "50", numericValue: 50, suffix: t.hero.statTon, label: t.hero.statCapacity, icon: PackageSearch },
    { value: "24", numericValue: 24, suffix: t.hero.statHour, label: t.hero.statFreshness, icon: Clock },
    { value: "HACCP", suffix: "", label: t.hero.statCert, icon: ShieldCheck },
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
      className="relative min-h-[92vh] sm:min-h-screen flex flex-col overflow-hidden"
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

        {/* Scrim vertical: kolom teks rata tengah, jadi kiri-kanan harus sama gelapnya */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />

        {/* Fade ke halaman di bawah — samakan dengan pb konten (h-16/20 = pb-16/20) biar tidak menimpa statistik */}
        <div className="absolute inset-x-0 bottom-0 h-16 sm:h-20 bg-gradient-to-t from-bg to-transparent" />
      </div>

      {/* Content — tiga zona vertikal: lockup di atas, cerita di tengah, angka di dasar hero */}
      <div className="relative z-10 flex flex-1 w-full flex-col items-center px-6 sm:px-10 lg:px-16 pt-6 sm:pt-10 lg:pt-12 pb-16 sm:pb-20">
        {/* Logo + Nama brand */}
        <div
          className={`flex items-center justify-center gap-3 hero-stagger ${heroLoaded ? "hero-stagger-visible" : ""}`}
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

        {/* Zona tengah: flex-1 + justify-center supaya sisa tinggi viewport ketiban di atas-bawah
            blok ini, bukan mengendap jadi pita foto kosong di bawah statistik */}
        <div className="flex w-full max-w-2xl flex-1 flex-col items-center justify-center text-center">
          <h1
            className={`font-heading font-bold leading-[1.1] tracking-tight hero-stagger ${heroLoaded ? "hero-stagger-visible" : ""}`}
            style={{ transitionDelay: "80ms" }}
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
            style={{ transitionDelay: "130ms" }}
          />

          <p
            className={`text-sm sm:text-base text-white/80 leading-relaxed max-w-xl mb-8 hero-stagger ${heroLoaded ? "hero-stagger-visible" : ""}`}
            style={{ transitionDelay: "180ms" }}
          >
            {description}
          </p>

          <div
            className={`flex flex-wrap items-center justify-center gap-3 hero-stagger ${heroLoaded ? "hero-stagger-visible" : ""}`}
            style={{ transitionDelay: "260ms" }}
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
        </div>

        <div
          ref={statsRef}
          className={`w-full max-w-3xl grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-6 border-t border-white/10 hero-stagger ${heroLoaded ? "hero-stagger-visible" : ""}`}
          style={{ transitionDelay: "380ms" }}
        >
          {STATS.map((item) => (
            <div key={item.label} className="group flex flex-col items-center">
              <item.icon className="w-4 h-4 text-brand-forest-300 mb-2 opacity-80 group-hover:opacity-100 transition-opacity duration-200" />
              <p className="font-mono text-xl sm:text-2xl font-bold text-white tracking-tight">
                {typeof item.numericValue === "number" ? (
                  <AnimatedCounter
                    target={item.numericValue}
                    suffix={item.suffix}
                    isVisible={statsVisible}
                  />
                ) : (
                  item.value
                )}
              </p>
              <p className="text-[11px] text-white/75 mt-0.5 font-medium leading-snug">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
