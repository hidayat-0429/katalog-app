import {
  Search,
  ArrowRight,
  ArrowLeft,
  Leaf,
  Package2,
  Truck,
  ShieldCheck,
  Boxes,
  ClipboardCheck,
  ThermometerSnowflake,
  Warehouse,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import EmptyState from "@/components/EmptyState";
import { ProductSkeletonGrid } from "@/components/ProductSkeleton";
import Link from "next/link";
import PaginationControls from "@/components/PaginationControls";
import Image from "next/image";
import Container from "@/components/Container";
import { Prisma } from "@prisma/client";
import { Suspense } from "react";
import HeroCinematic from "@/components/HeroCinematic";
import ScrollReveal from "@/components/ScrollReveal";
import TrustBanner from "@/components/TrustBanner";
import FeaturesGrid from "@/components/FeaturesGrid";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{
    kategori?: string;
    q?: string;
    page?: string;
    katalog?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;

  const rawQ = resolvedSearchParams.q || "";
  const q = rawQ.trim().slice(0, 100);
  const categoryId = resolvedSearchParams.kategori || "";

  const isFiltering = q.length > 0 || categoryId.length > 0;
  const isCatalogMode =
    isFiltering ||
    resolvedSearchParams.katalog === "semua" ||
    Boolean(resolvedSearchParams.page);

  const whereClause: Prisma.ProductWhereInput = { isActive: true };
  if (categoryId) whereClause.categoryId = categoryId;
  if (q) whereClause.name = { contains: q, mode: "insensitive" };

  const orderByClause: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };

  const limit = 12;
  const totalCount = await prisma.product.count({ where: whereClause });
  const totalPages = Math.max(Math.ceil(totalCount / limit), 1);

  const rawPage = Number(resolvedSearchParams.page);
  const requestedPage = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const safePage = Math.min(requestedPage, totalPages);
  const skip = (safePage - 1) * limit;

  const [categories, products, featuredProducts] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: whereClause,
      include: { category: true },
      orderBy: orderByClause,
      skip: isCatalogMode ? skip : 0,
      take: isCatalogMode ? limit : 4,
    }),
    !isCatalogMode
      ? prisma.product.findMany({
          where: { isActive: true, isFeatured: true },
          include: { category: true },
          take: 4,
        })
      : Promise.resolve([]),
  ]);

  const curatedProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4);

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
                Kembali ke Beranda
              </Link>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h1 className="font-heading text-3xl sm:text-3xl font-bold tracking-tight text-charcoal dark:text-stone-100">
                    Katalog Produk
                  </h1>
                  <p className="font-sans text-sm text-charcoal-muted dark:text-stone-400 mt-2 max-w-xl leading-relaxed">
                    Komoditas jamur segar, kaleng steril, pouch retort, dan olahan beku langsung dari pabrik.
                  </p>
                </div>
                <span className="text-xs text-charcoal-muted font-medium shrink-0">
                  {totalCount} komoditas
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
                    placeholder="Cari produk..."
                    aria-label="Cari produk"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-bg-subtle dark:bg-[#1a1a16] border border-stone-200 dark:border-stone-700 rounded-lg text-charcoal dark:text-stone-100 placeholder:text-charcoal-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 motion-safe:transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover text-white font-medium py-2.5 px-5 text-sm rounded-lg motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-out shrink-0"
                >
                  Terapkan
                </button>

                {q && (
                  <Link
                    href={categoryId ? `/?katalog=semua&kategori=${categoryId}` : "/?katalog=semua"}
                    className="text-sm text-charcoal-muted hover:text-charcoal font-medium py-2.5 px-3 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-bg-subtle motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-out text-center shrink-0"
                  >
                    Reset
                  </Link>
                )}
              </form>

              {/* Tab kategori */}
              <div className="flex items-center gap-2 overflow-x-auto pb-0.5 lg:border-l lg:border-stone-200 lg:dark:border-stone-800 lg:pl-4">
                <Link
                  href={q ? `/?katalog=semua&q=${encodeURIComponent(q)}` : "/?katalog=semua"}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-out ${
                    !categoryId
                      ? "bg-primary text-white"
                      : "text-charcoal-muted hover:text-charcoal hover:bg-bg-subtle dark:hover:bg-stone-800"
                  }`}
                >
                  Semua
                </Link>
                {categories.map((cat) => {
                  const params = new URLSearchParams();
                  params.set("katalog", "semua");
                  params.set("kategori", cat.id);
                  if (q) params.set("q", q);
                  const isActive = categoryId === cat.id;
                  return (
                    <Link
                      key={cat.id}
                      href={`/?${params.toString()}`}
                      className={`px-3 py-3 rounded-lg text-xs font-semibold whitespace-nowrap motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-out ${
                        isActive
                          ? "bg-primary text-white"
                          : "text-charcoal-muted hover:text-charcoal hover:bg-bg-subtle dark:hover:bg-stone-800"
                      }`}
                    >
                      {cat.name}
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
                      name={product.name}
                      price={product.price}
                      unit={product.unit}
                      stock={product.stock}
                      imageUrl={product.imageUrl}
                      categoryName={product.category.name}
                      createdAt={product.createdAt}
                      updatedAt={product.updatedAt}
                    />
                  ))}
                </div>
              </Suspense>
            ) : (
              <EmptyState
                title="Produk tidak ditemukan"
                description="Tidak ada komoditas yang cocok dengan pencarian atau filter."
                action={{ label: "Lihat Semua Produk", href: "/?katalog=semua" }}
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

          {/* 4. PRODUK PILIHAN */}
          <ScrollReveal>
            <section className="py-16 sm:py-24">
              <Container>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2">Produk Kami</p>
                    <h2 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                      Komoditas pilihan
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5">
                      Jamur segar, kaleng steril, pouch retort, beku, hingga produk olahan siap pasok untuk kebutuhan bisnis Anda.
                    </p>
                  </div>
                  <Link
                    href="/?katalog=semua"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-forest-600 dark:text-brand-forest-400 hover:underline shrink-0"
                  >
                    Semua produk ({totalCount}) <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <Suspense fallback={<ProductSkeletonGrid count={4} />}>
                    {curatedProducts.map((product, idx) => (
                      <ScrollReveal key={product.id} delay={idx * 100}>
                        <ProductCard
                          id={product.id}
                          name={product.name}
                          price={product.price}
                          unit={product.unit}
                          stock={product.stock}
                          imageUrl={product.imageUrl}
                          categoryName={product.category.name}
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
                    Proses Mudah & Transparan
                  </p>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                    Alur Pemesanan B2B
                  </h2>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
                    Tiga langkah terstruktur pengadaan pasokan jamur untuk kebutuhan restoran, katering, hotel, dan industri pengolahan pangan.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  {[
                    {
                      step: "01",
                      icon: Boxes,
                      title: "Pilih Komoditas & Volume",
                      desc: "Tentukan varian komoditas (jamur segar, kaleng steril, atau pouch retort) serta estimasi kuantitas yang dibutuhkan bisnis Anda.",
                    },
                    {
                      step: "02",
                      icon: Truck,
                      title: "Tentukan Metode Kirim",
                      desc: "Pilih armada berpendingin (cold chain) untuk menjaga suhu kesegaran, kargo reguler, atau ambil langsung di pabrik Purwodadi.",
                    },
                    {
                      step: "03",
                      icon: ClipboardCheck,
                      title: "Konfirmasi Faktur & WhatsApp",
                      desc: "Dapatkan rincian faktur instan. Tim operasional kami siap memproses pesanan dan mengoordinasikan jadwal muat secara real-time.",
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
                    <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-3">Standar Mutu</p>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight mb-4">
                      Komitmen pasokan pangan terpercaya
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      Fasilitas perkebunan dataran tinggi dan pengolahan terpadu PT Eka Timur Raya di Pasuruan.
                    </p>
                    <Link
                      href="/tentang"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-forest-600 dark:text-brand-forest-400 hover:underline mt-6"
                    >
                      Profil perusahaan <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </ScrollReveal>

                  {/* Feature Cards Grid */}
                  <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        icon: Leaf,
                        num: "01",
                        title: "Budidaya Dataran Tinggi",
                        desc: "Kebun di Nongkojajar, 1.850 mdpl. Iklim stabil untuk pertumbuhan jamur kancing premium.",
                      },
                      {
                        icon: Package2,
                        num: "02",
                        title: "Panen & Seleksi Harian",
                        desc: "Dipanen setiap pagi, disortir berdasarkan ukuran dan keutuhan untuk dapur komersial.",
                      },
                      {
                        icon: ShieldCheck,
                        num: "03",
                        title: "Pengolahan Langsung Pabrik",
                        desc: "Kaleng dan pouch retort steril diproses di fasilitas Purwodadi kesegaran terkunci.",
                      },
                      {
                        icon: Truck,
                        num: "04",
                        title: "Pasokan Rutin Horeka",
                        desc: "Melayani volume berkelanjutan untuk restoran, hotel, katering, dan pabrik pangan.",
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
                            <span className="font-mono text-xs font-bold text-neutral-400 dark:text-neutral-600">{num}</span>
                          </div>
                          
                          <div>
                            <h3 className="font-display text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">{title}</h3>
                            <p className="font-sans text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{desc}</p>
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
                      Jaminan Mutu Pengiriman
                    </p>
                    <h2 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                      Pilihan Armada & Logistik
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1.5 max-w-xl">
                      Fleksibilitas opsi pengiriman yang dirancang untuk menjaga higienitas dan kesegaran komoditas hingga tiba di fasilitas Anda.
                    </p>
                  </div>
                  <Link
                    href="/kontak"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-forest-600 dark:text-brand-forest-400 hover:underline shrink-0"
                  >
                    Konsultasi pengiriman <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      icon: ThermometerSnowflake,
                      title: "Armada Berpendingin (Cold Chain)",
                      badge: "Suhu 2°C – 4°C Terjaga",
                      badgeColor: "bg-brand-forest-50 text-brand-forest-700 dark:bg-brand-forest-900/30 dark:text-brand-forest-300 border-brand-forest-200 dark:border-brand-forest-800",
                      desc: "Truk reefer berpendingin khusus untuk memastikan jamur kancing segar tidak layu, tidak berubah warna, dan tetap renyah saat sampai di dapur Anda.",
                    },
                    {
                      icon: ShieldCheck,
                      title: "Kargo Kering Terproteksi",
                      badge: "Standar Pallet Industri",
                      badgeColor: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700",
                      desc: "Distribusi aman untuk produk jamur kaleng steril dan pouch retort tahan simpan panjang, dikemas dengan karton berlapis dan pallet anti-kelembaban.",
                    },
                    {
                      icon: Warehouse,
                      title: "Pengambilan Mandiri di Pabrik",
                      badge: "Fasilitas Pasuruan",
                      badgeColor: "bg-brand-forest-50 text-brand-forest-700 dark:bg-brand-forest-900/30 dark:text-brand-forest-300 border-brand-forest-200 dark:border-brand-forest-800",
                      desc: "Akses langsung ke fasilitas gudang dan loading dock kami di Purwodadi, Pasuruan. Mitra bebas menggunakan armada logistik sendiri sesuai jadwal.",
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
                        alt="Fasilitas dan Produk PT Eka Timur Raya - Sehat Bersama ETIRA"
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out hover:scale-[1.02]"
                      />
                    </div>
                  </ScrollReveal>
                  <ScrollReveal direction="right" delay={150} className="lg:col-span-7">
                    <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-3">Tentang Etira Mushrooms</p>
                    <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight mb-3">
                      PT Eka Timur Raya
                    </h2>
                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 italic mb-5 border-l-2 border-brand-forest-300 dark:border-brand-forest-700 pl-4">
                      &ldquo;To Be One Stop Point for All Mushrooms Needs of The Customers.&rdquo;
                    </p>
                    <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed mb-3">
                      Berdiri sejak 1999 di Purwodadi, Pasuruan. Fokus pada pasar B2B dengan pasokan konsisten, steril, dan bernutrisi.
                    </p>
                    <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed mb-8">
                      Fasilitas terintegrasi dari kebun Nongkojajar hingga lini kaleng dan pouch steril siap untuk kebutuhan bisnis Anda.
                    </p>
                    <Link
                      href="/tentang"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-brand-forest-600 dark:text-brand-forest-400 hover:underline"
                    >
                      Selengkapnya <ArrowRight className="w-3.5 h-3.5" />
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
                  Siap memasok kebutuhan jamur bisnis Anda?
                </h2>
                <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-8 max-w-lg mx-auto">
                  Konsultasikan spesifikasi produk, volume, kemasan, atau kebutuhan private label bersama tim kami.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/kontak"
                    className="inline-flex items-center justify-center gap-2 bg-white text-brand-forest-700 hover:bg-neutral-100 px-7 py-3.5 rounded-lg font-semibold text-sm motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-out"
                  >
                    Hubungi Kami
                  </Link>
                  <Link
                    href="/?katalog=semua"
                    className="inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white/60 hover:bg-white/10 text-white px-7 py-3.5 rounded-lg font-semibold text-sm motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-out"
                  >
                    Buka Katalog
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
