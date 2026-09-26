'use client';

import {
  ArrowRight,
  ArrowLeft,
  Search,
  Leaf,
  Package2,
  Truck,
  ShieldCheck,
  Boxes,
  ClipboardCheck,
  ThermometerSnowflake,
  Warehouse,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import ProductCard from '@/components/ProductCard';
import EmptyState from '@/components/EmptyState';
import { ProductSkeletonGrid } from '@/components/ProductSkeleton';
import PaginationControls from '@/components/PaginationControls';
import Container from '@/components/Container';
import HeroCinematicWrapper from '@/components/HeroCinematicWrapper';
import ScrollReveal from '@/components/ScrollReveal';
import TrustBanner from '@/components/TrustBanner';
import { useLocale } from '@/components/LocaleProvider';
import { localizeProduct, localizeName } from '@/lib/productText';

interface Category {
  id: string;
  name: string;
  nameEn?: string | null;
}

interface Product {
  id: string;
  name: string;
  nameEn?: string | null;
  price: number;
  unit: string;
  stock: number;
  imageUrl: string | null;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  category: {
    name: string;
    nameEn?: string | null;
  };
}

interface HomePageClientProps {
  isCatalogMode: boolean;
  categories: Category[];
  products: Product[];
  curatedProducts: Product[];
  totalCount: number;
  safePage: number;
  totalPages: number;
  q: string;
  categoryId: string;
}

export default function HomePageClient({
  isCatalogMode,
  categories,
  products,
  curatedProducts,
  totalCount,
  safePage,
  totalPages,
  q,
  categoryId,
}: HomePageClientProps) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-[#faf9f6] dark:bg-[#0f1110] text-[#1f2421] dark:text-stone-100">
      {/* -- MODE 1: KATALOG ----------------------------------- */}
      {isCatalogMode ? (
        <section className="py-10 sm:py-14">
          <Container>
            {/* Header */}
            <div className="mb-8">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-charcoal-muted hover:text-charcoal motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-out mb-5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {t.catalog.backToHome}
              </Link>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h1 className="font-heading text-3xl sm:text-3xl font-bold tracking-tight text-charcoal dark:text-stone-100">
                    {t.catalog.title}
                  </h1>
                  <p className="font-sans text-sm text-charcoal-muted dark:text-stone-400 mt-2 max-w-xl leading-relaxed">
                    {t.homepage.selectedProductsDescription}
                  </p>
                </div>
                <span className="text-xs text-charcoal-muted font-medium shrink-0">
                  {totalCount} {t.catalog.commoditiesCount}
                </span>
              </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white dark:bg-[#141715] border border-stone-200 dark:border-stone-800 rounded-xl p-4 mb-8 flex flex-col lg:flex-row gap-4">
              <form action="/" method="GET" className="flex flex-col sm:flex-row gap-3 flex-1">
                <input type="hidden" name="katalog" value="semua" />
                {categoryId && <input type="hidden" name="kategori" value={categoryId} />}

                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    name="q"
                    defaultValue={q}
                    placeholder={t.catalog.search}
                    aria-label={t.catalog.search}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-bg-subtle dark:bg-[#1a1a16] border border-stone-200 dark:border-stone-700 rounded-lg text-charcoal dark:text-stone-100 placeholder:text-charcoal-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 motion-safe:transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover text-white font-medium py-2.5 px-5 text-sm rounded-lg motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-out shrink-0"
                >
                  {t.catalog.apply}
                </button>

                {q && (
                  <Link
                    href={categoryId ? `/?katalog=semua&kategori=${categoryId}` : '/?katalog=semua'}
                    className="text-sm text-charcoal-muted hover:text-charcoal font-medium py-2.5 px-3 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-bg-subtle motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-out text-center shrink-0"
                  >
                    {t.catalog.reset}
                  </Link>
                )}
              </form>

              {/* Tab kategori */}
              <div className="flex items-center gap-2 overflow-x-auto pb-0.5 lg:border-l lg:border-stone-200 lg:dark:border-stone-800 lg:pl-4">
                <Link
                  href={q ? `/?katalog=semua&q=${encodeURIComponent(q)}` : '/?katalog=semua'}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-out ${
                    !categoryId
                      ? 'bg-primary text-white'
                      : 'text-charcoal-muted hover:text-charcoal hover:bg-bg-subtle dark:hover:bg-stone-800'
                  }`}
                >
                  {t.catalog.allProducts}
                </Link>
                {categories.map((cat) => {
                  const params = new URLSearchParams();
                  params.set('katalog', 'semua');
                  params.set('kategori', cat.id);
                  if (q) params.set('q', q);
                  const isActive = categoryId === cat.id;
                  return (
                    <Link
                      key={cat.id}
                      href={`/?${params.toString()}`}
                      className={`px-3 py-3 rounded-lg text-xs font-semibold whitespace-nowrap motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-out ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-charcoal-muted hover:text-charcoal hover:bg-bg-subtle dark:hover:bg-stone-800'
                      }`}
                    >
                      {localizeName(cat, locale)}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Grid produk */}
            {products.length > 0 ? (
              <Suspense fallback={<ProductSkeletonGrid count={12} />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={localizeProduct(product, locale).name}
                      price={product.price}
                      unit={product.unit}
                      stock={product.stock}
                      imageUrl={product.imageUrl}
                      categoryName={product.category.name} categoryNameEn={product.category.nameEn}
                      createdAt={product.createdAt}
                      updatedAt={product.updatedAt}
                    />
                  ))}
                </div>
              </Suspense>
            ) : (
              <EmptyState
                title={t.catalog.noProducts}
                description={t.orders.noOrdersDescription}
                action={{ label: t.catalog.allProducts, href: '/?katalog=semua' }}
              />
            )}

            <div className="mt-12 flex justify-center">
              <Suspense fallback={null}>
                <PaginationControls currentPage={safePage} totalPages={totalPages} />
              </Suspense>
            </div>
          </Container>
        </section>
      ) : (
        /* -- MODE 2: BERANDA ------------------------------------ */
        <>
          {/* 1. HERO Cinematic scroll parallax */}
          <HeroCinematicWrapper />

          {/* Shimmer divider */}
          <div className="shimmer-line mx-auto max-w-4xl" />

          {/* 2. TRUST BANNER - Client logos & Certifications */}
          <ScrollReveal>
            <TrustBanner />
          </ScrollReveal>

          {/* 3. PRODUK PILIHAN */}
          <ScrollReveal>
            <section className="py-16 sm:py-24">
              <Container>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2">
                      {t.homepage.selectedProducts}
                    </p>
                    <h2 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                      {t.homepage.selectedProductsSubtitle}
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5">
                      {t.homepage.selectedProductsDescription}
                    </p>
                  </div>
                  <Link
                    href="/?katalog=semua"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-forest-600 dark:text-brand-forest-400 hover:underline shrink-0"
                  >
                    {t.homepage.allProducts} ({totalCount}) <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <Suspense fallback={<ProductSkeletonGrid count={4} />}>
                    {curatedProducts.map((product, idx) => (
                      <ScrollReveal key={product.id} delay={idx * 100}>
                        <ProductCard
                          id={product.id}
                          name={localizeProduct(product, locale).name}
                          price={product.price}
                          unit={product.unit}
                          stock={product.stock}
                          imageUrl={product.imageUrl}
                          categoryName={product.category.name} categoryNameEn={product.category.nameEn}
                          createdAt={product.createdAt}
                          updatedAt={product.updatedAt}
                        />
                      </ScrollReveal>
                    ))}
                  </Suspense>
                </div>
              </Container>
            </section>
          </ScrollReveal>

          {/* Shimmer divider */}
          <div className="shimmer-line mx-auto max-w-4xl" />

          {/* 4. ALUR PEMESANAN B2B */}
          <ScrollReveal>
            <section className="py-16 sm:py-24">
              <Container>
                <div className="text-center max-w-2xl mx-auto mb-14">
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-forest-600 dark:text-brand-forest-400 mb-2">
                    {t.homepage.b2bOrderProcess}
                  </p>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                    {t.homepage.b2bOrderProcessTitle}
                  </h2>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
                    {t.homepage.b2bOrderProcessDescription}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  {[
                    {
                      step: '01',
                      icon: Boxes,
                      title: t.homepage.step1,
                      desc: t.homepage.step1Desc,
                    },
                    {
                      step: '02',
                      icon: Truck,
                      title: t.homepage.step2,
                      desc: t.homepage.step2Desc,
                    },
                    {
                      step: '03',
                      icon: ClipboardCheck,
                      title: t.homepage.step3,
                      desc: t.homepage.step3Desc,
                    },
                  ].map(({ step, icon: Icon, title, desc }, idx) => (
                    <ScrollReveal key={step} delay={idx * 120}>
                      <div className="h-full flex flex-col p-6 sm:p-8 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141715] shadow-xs">
                        <div className="flex items-center justify-between mb-6">
                          <div className="w-12 h-12 rounded-lg bg-brand-forest-50 dark:bg-brand-forest-900/30 flex items-center justify-center text-brand-forest-600 dark:text-brand-forest-400">
                            <Icon className="w-6 h-6 stroke-[2px]" />
                          </div>
                          <span className="font-mono text-xl sm:text-2xl font-bold text-neutral-300 dark:text-neutral-700">
                            {step}
                          </span>
                        </div>
                        <h3 className="font-heading text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                          {title}
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed flex-1">
                          {desc}
                        </p>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </Container>
            </section>
          </ScrollReveal>

          {/* 7. KEUNGGULAN */}
          <ScrollReveal>
            <section className="section-divider-wave py-16 sm:py-24 bg-neutral-50 dark:bg-neutral-900">
              <Container>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
                  {/* Section Header */}
                  <ScrollReveal direction="left" className="lg:col-span-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-3">
                      {t.homepage.qualityStandards}
                    </p>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight mb-4">
                      {t.homepage.qualityStandardsTitle}
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {t.homepage.qualityStandardsDescription}
                    </p>
                    <Link
                      href="/tentang"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-forest-600 dark:text-brand-forest-400 hover:underline mt-6"
                    >
                      {t.homepage.companyProfile} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </ScrollReveal>

                  {/* Feature Cards Grid */}
                  <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        icon: Leaf,
                        num: '01',
                        title: t.homepage.feature1,
                        desc: t.homepage.feature1Desc,
                      },
                      {
                        icon: Package2,
                        num: '02',
                        title: t.homepage.feature2,
                        desc: t.homepage.feature2Desc,
                      },
                      {
                        icon: ShieldCheck,
                        num: '03',
                        title: t.homepage.feature3,
                        desc: t.homepage.feature3Desc,
                      },
                      {
                        icon: Truck,
                        num: '04',
                        title: t.homepage.feature4,
                        desc: t.homepage.feature4Desc,
                      },
                    ].map(({ icon: Icon, num, title, desc }, idx) => (
                      <ScrollReveal key={num} delay={idx * 120}>
                        <div
                          data-num={num}
                          className="feature-card-num flex flex-col gap-4 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600 motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-out motion-safe:hover:-translate-y-0.5"
                        >
                          <div className="flex items-center justify-between">
                            <div className="w-16 h-16 rounded-lg bg-brand-forest-100 dark:bg-brand-forest-900/30 flex items-center justify-center">
                              <Icon className="w-8 h-8 text-brand-forest-600 dark:text-brand-forest-400 stroke-[2px]" />
                            </div>
                            <span className="font-mono text-xs font-bold text-neutral-400 dark:text-neutral-600">
                              {num}
                            </span>
                          </div>

                          <div>
                            <h3 className="font-display text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                              {title}
                            </h3>
                            <p className="font-sans text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                              {desc}
                            </p>
                          </div>
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              </Container>
            </section>
          </ScrollReveal>

          {/* Shimmer divider */}
          <div className="shimmer-line mx-auto max-w-4xl" />

          {/* 6. PILIHAN ARMADA & LOGISTIK */}
          <ScrollReveal>
            <section className="py-16 sm:py-24 px-4 sm:px-6">
              <div className="mb-12">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-brand-forest-600 dark:text-brand-forest-400 mb-2">
                      {t.homepage.deliveryGuarantee}
                    </p>
                    <h2 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                      {t.homepage.fleetAndLogistics}
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1.5 max-w-xl">
                      {t.homepage.fleetAndLogisticsDescription}
                    </p>
                  </div>
                  <Link
                    href="/kontak"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-forest-600 dark:text-brand-forest-400 hover:underline shrink-0"
                  >
                    {t.homepage.consultDelivery} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: ThermometerSnowflake,
                    title: t.fleet.coldChain,
                    badge: t.fleet.coldChainBadge,
                    badgeColor:
                      'bg-brand-forest-50 text-brand-forest-700 dark:bg-brand-forest-900/30 dark:text-brand-forest-300 border-brand-forest-200 dark:border-brand-forest-800',
                    desc: t.fleet.coldChainDesc,
                  },
                  {
                    icon: ShieldCheck,
                    title: t.fleet.dryFleet,
                    badge: t.fleet.dryFleetBadge,
                    badgeColor:
                      'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700',
                    desc: t.fleet.dryFleetDesc,
                  },
                  {
                    icon: Warehouse,
                    title: t.fleet.selfPickup,
                    badge: t.fleet.selfPickupBadge,
                    badgeColor:
                      'bg-brand-forest-50 text-brand-forest-700 dark:bg-brand-forest-900/30 dark:text-brand-forest-300 border-brand-forest-200 dark:border-brand-forest-800',
                    desc: t.fleet.selfPickupDesc,
                  },
                ].map(({ icon: Icon, title, badge, badgeColor, desc }, idx) => (
                  <ScrollReveal key={title} delay={idx * 120}>
                    <div className="h-full flex flex-col p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141715] hover:border-neutral-300 dark:hover:border-neutral-700 motion-safe:transition-all">
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="w-11 h-11 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
                          <Icon className="w-5 h-5 stroke-[2px]" />
                        </div>
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${badgeColor}`}>
                          {badge}
                        </span>
                      </div>
                      <h3 className="font-heading text-base font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                        {title}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed flex-1">
                        {desc}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </section>
          </ScrollReveal>
          <div className="shimmer-line mx-auto max-w-4xl" />

          {/* 7. TENTANG */}
          <ScrollReveal>
            <section className="py-16 sm:py-24">
              <Container>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                  <ScrollReveal direction="left" className="lg:col-span-5">
                    <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
                      <Image
                        src="/hero-branding.jpg"
                        alt={t.about.companyName}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out hover:scale-[1.02]"
                      />
                    </div>
                  </ScrollReveal>
                  <ScrollReveal direction="right" delay={150} className="lg:col-span-7">
                    <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-3">
                      {t.homepage.about}
                    </p>
                    <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight mb-3">
                      {t.about.companyName}
                    </h2>
                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 italic mb-5 border-l-2 border-brand-forest-300 dark:border-brand-forest-700 pl-4">
                      &ldquo;To Be One Stop Point for All Mushrooms Needs of The Customers.&rdquo;
                    </p>
                    <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed mb-3">
                      {t.homepage.aboutDescription}
                    </p>
                    <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed mb-8">
                      {t.homepage.aboutFacility}
                    </p>
                    <Link
                      href="/tentang"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-brand-forest-600 dark:text-brand-forest-400 hover:underline"
                    >
                      {t.homepage.moreInfo} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </ScrollReveal>
                </div>
              </Container>
            </section>
          </ScrollReveal>

          {/* 9. CTA */}
          <ScrollReveal>
            <section className="bg-brand-forest-600 dark:bg-brand-forest-700 py-16 sm:py-20 px-4 sm:px-6">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
                  {t.homepage.ctaTitle}
                </h2>
                <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-8 max-w-lg mx-auto">
                  {t.homepage.ctaDescription}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/kontak"
                    className="inline-flex items-center justify-center gap-2 bg-white text-brand-forest-700 hover:bg-neutral-100 px-7 py-3.5 rounded-lg font-semibold text-sm motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-out"
                  >
                    {t.homepage.contactUs}
                  </Link>
                  <Link
                    href="/?katalog=semua"
                    className="inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white/60 hover:bg-white/10 text-white px-7 py-3.5 rounded-lg font-semibold text-sm motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-out"
                  >
                    {t.homepage.openCatalog}
                  </Link>
                </div>
              </div>
            </section>
          </ScrollReveal>
        </>
      )}
    </div>
  );
}
