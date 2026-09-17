import { Search, SlidersHorizontal, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";
import PaginationControls from "@/components/PaginationControls";
import Image from "next/image";
import Container from "@/components/Container";
import { Prisma } from "@prisma/client";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; q?: string; sort?: string; page?: string; katalog?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  
  // Sanitasi & Normalisasi Input
  const rawQ = resolvedSearchParams.q || "";
  const q = rawQ.trim().slice(0, 100);
  
  const categoryId = resolvedSearchParams.kategori || "";
  const sort = resolvedSearchParams.sort || "terbaru";

  const isFiltering = q.length > 0 || categoryId.length > 0 || (sort && sort !== "terbaru");
  const isCatalogMode = isFiltering || resolvedSearchParams.katalog === "semua" || Boolean(resolvedSearchParams.page);

  // Type-Safety: Prisma.ProductWhereInput
  const whereClause: Prisma.ProductWhereInput = { isActive: true };
  if (categoryId) {
    whereClause.categoryId = categoryId;
  }
  if (q) {
    whereClause.name = { contains: q, mode: "insensitive" };
  }

  // Type-Safety: Prisma.ProductOrderByWithRelationInput
  let orderByClause: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  
  if (sort === "harga-asc") {
    orderByClause = { price: "asc" };
  } else if (sort === "harga-desc") {
    orderByClause = { price: "desc" };
  } else if (sort === "nama-asc") {
    orderByClause = { name: "asc" };
  }

  const limit = 12;
  const totalCount = await prisma.product.count({ where: whereClause });
  const totalPages = Math.max(Math.ceil(totalCount / limit), 1);

  // Sanitasi Pagination
  const rawPage = Number(resolvedSearchParams.page);
  const requestedPage = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const safePage = Math.min(requestedPage, totalPages);
  
  const skip = (safePage - 1) * limit;

  // Optimasi Parallel Query
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

  // Jika produk featured kosong di database, gunakan 4 produk teratas yang aktif
  const curatedProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-[#faf9f6] dark:bg-[#0f1110] text-[#1f2421] dark:text-stone-100">
      {/* ─────────────────────────────────────────────────────────────
          MODE 1: KATALOG PRODUK EFISIEN (Saat mencari / filter / buka katalog)
          ───────────────────────────────────────────────────────────── */}
      {isCatalogMode ? (
        <section className="py-10 sm:py-14">
          <Container>
            {/* Header Katalog */}
            <div className="border-b border-stone-200 dark:border-stone-800 pb-8 mb-8">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 dark:text-stone-400 dark:text-stone-500 hover:text-[#1b382b] dark:text-emerald-400 transition-colors mb-4"
              >
                &larr; Kembali ke Beranda
              </Link>
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h1 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight text-[#1f2421] dark:text-stone-100">
                    Katalog Produk &amp; Pasokan
                  </h1>
                  <p className="font-sans text-sm text-stone-600 dark:text-stone-400 dark:text-stone-500 mt-2 max-w-2xl leading-relaxed">
                    Daftar komoditas jamur segar panen harian, kaleng steril, pouch retort, dan olahan beku PT Eka Timur Raya untuk mitra bisnis Horeka dan industri kuliner.
                  </p>
                </div>

                <div className="text-xs text-stone-500 dark:text-stone-400 dark:text-stone-500 font-medium">
                  Menampilkan {products.length} dari {totalCount} komoditas
                </div>
              </div>

              {/* Toolbar Pencarian & Filter */}
              <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-800/80 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                {/* Search & Sort Form */}
                <form action="/" method="GET" className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input type="hidden" name="katalog" value="semua" />
                  {categoryId && <input type="hidden" name="kategori" value={categoryId} />}

                  <div className="relative flex-1 sm:w-72">
                    <Search className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      name="q"
                      defaultValue={q}
                      placeholder="Cari nama jamur atau kemasan..."
                      className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-[#141715] border border-stone-300 dark:border-stone-700 rounded-md text-[#1f2421] dark:text-stone-100 placeholder:text-stone-400 dark:text-stone-500 focus:outline-none focus:border-[#1b382b] focus:ring-1 focus:ring-[#1b382b] transition-colors"
                    />
                  </div>

                  <div className="relative sm:w-48">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      name="sort"
                      defaultValue={sort}
                      className="w-full pl-9 pr-8 py-2 text-sm bg-white dark:bg-[#141715] border border-stone-300 dark:border-stone-700 rounded-md text-stone-700 dark:text-stone-300 appearance-none cursor-pointer focus:outline-none focus:border-[#1b382b] focus:ring-1 focus:ring-[#1b382b] transition-colors"
                    >
                      <option value="terbaru">Terbaru</option>
                      <option value="harga-asc">Harga: Rendah ke Tinggi</option>
                      <option value="harga-desc">Harga: Tinggi ke Rendah</option>
                      <option value="nama-asc">Nama: A – Z</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="bg-[#1b382b] dark:bg-[#204232] hover:bg-[#163024] dark:hover:bg-[#2a5742] text-white font-medium py-2 px-5 text-sm rounded-md transition-colors cursor-pointer"
                  >
                    Terapkan
                  </button>
                </form>

                {/* Tab Kategori */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none font-sans text-xs">
                  <a
                    href={
                      q || sort !== "terbaru"
                        ? `/?katalog=semua&${q ? `q=${encodeURIComponent(q)}&` : ""}${sort !== "terbaru" ? `sort=${sort}` : ""}`
                        : "/?katalog=semua"
                    }
                    className={`px-3.5 py-2 rounded-md transition-colors whitespace-nowrap font-medium border ${
                      !categoryId
                        ? "bg-[#1b382b] dark:bg-[#204232] text-white border-[#1b382b]"
                        : "bg-white dark:bg-[#141715] text-stone-600 dark:text-stone-400 dark:text-stone-500 border-stone-300 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
                    }`}
                  >
                    Semua Kategori
                  </a>

                  {categories.map((cat) => {
                    const params = new URLSearchParams();
                    params.set("katalog", "semua");
                    params.set("kategori", cat.id);
                    if (q) params.set("q", q);
                    if (sort && sort !== "terbaru") params.set("sort", sort);

                    const isActive = categoryId === cat.id;

                    return (
                      <a
                        key={cat.id}
                        href={`/?${params.toString()}`}
                        className={`px-3.5 py-2 rounded-md transition-colors whitespace-nowrap font-medium border ${
                          isActive
                            ? "bg-[#1b382b] dark:bg-[#204232] text-white border-[#1b382b]"
                            : "bg-white dark:bg-[#141715] text-stone-600 dark:text-stone-400 dark:text-stone-500 border-stone-300 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
                        }`}
                      >
                        {cat.name}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Grid Produk */}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7">
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
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Produk tidak ditemukan"
                description="Tidak ada komoditas jamur yang cocok dengan pencarian atau filter yang dipilih."
                action={{ label: "Lihat Semua Produk", href: "/?katalog=semua" }}
              />
            )}

            {/* Pagination Controls */}
            <div className="mt-12 flex justify-center">
              <PaginationControls currentPage={safePage} totalPages={totalPages} />
            </div>
          </Container>
        </section>
      ) : (
        /* ─────────────────────────────────────────────────────────────
           MODE 2: BERANDA RESMI ETIRA MUSHROOMS (Editorial Corporate)
           ───────────────────────────────────────────────────────────── */
        <>
          {/* 1. HERO SECTION (Asymmetric 2-Column) */}
          <section className="pt-12 sm:pt-16 pb-14 sm:pb-20">
            <Container>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                {/* Teks Kiri */}
                <div className="lg:col-span-7 flex flex-col order-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-[#1b382b] dark:bg-[#204232]" />
                    <span className="font-sans text-xs font-semibold uppercase tracking-widest text-stone-500 dark:text-stone-400 dark:text-stone-500">
                      Pemasok Jamur Industri &bull; Berdiri 1999
                    </span>
                  </div>

                  <h1 className="font-sans font-bold text-4xl sm:text-5xl lg:text-6xl text-[#1f2421] dark:text-stone-100 tracking-tight leading-[1.08]">
                    Pasokan jamur untuk kebutuhan bisnis.
                  </h1>

                  {/* Foto khusus layar mobile (tampil di antara headline dan subheadline) */}
                  <div className="block lg:hidden my-6">
                    <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden border border-stone-200 dark:border-stone-800/90 shadow-xs">
                      <Image
                        src="/hero-mushroom.jpg"
                        alt="Jamur segar hasil panen PT Eka Timur Raya"
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover object-center"
                      />
                    </div>
                  </div>

                  <p className="font-sans text-base sm:text-lg text-stone-600 dark:text-stone-400 dark:text-stone-500 leading-relaxed max-w-xl mt-2 lg:mt-6">
                    Produk segar dan olahan dengan pasokan yang konsisten untuk restoran, hotel, katering, dan mitra industri pangan langsung dari fasilitas kami di Nongkojajar, Pasuruan.
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mt-8 sm:mt-10">
                    <Link
                      href="/?katalog=semua"
                      className="bg-[#1b382b] dark:bg-[#204232] hover:bg-[#163024] dark:hover:bg-[#2a5742] text-white px-7 py-3.5 rounded-md font-medium text-sm transition-colors shadow-xs text-center sm:flex-none"
                    >
                      Lihat Katalog
                    </Link>
                    <Link
                      href="/kontak"
                      className="border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 px-7 py-3.5 rounded-md font-medium text-sm transition-colors text-center sm:flex-none"
                    >
                      Hubungi Kami
                    </Link>
                  </div>
                </div>

                {/* Foto Kanan (Desktop) */}
                <div className="hidden lg:block lg:col-span-5 order-2">
                  <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden border border-stone-200 dark:border-stone-800/90 shadow-sm">
                    <Image
                      src="/hero-mushroom.jpg"
                      alt="Jamur segar hasil panen PT Eka Timur Raya"
                      fill
                      priority
                      sizes="50vw"
                      className="object-cover object-center"
                    />
                  </div>
                </div>
              </div>
            </Container>
          </section>

          {/* 2. TRUST / TARGET MARKET BAR (Horizontal Text, No Cards) */}
          <section className="w-full border-y border-stone-200 dark:border-stone-800 bg-white dark:bg-[#141715] py-5 sm:py-6">
            <Container>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
                <span className="font-sans text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                  Melayani kebutuhan:
                </span>
                <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-stone-700 dark:text-stone-300 uppercase">
                  RESTORAN &bull; HOTEL &bull; CATERING &bull; DISTRIBUTOR &bull; PABRIK PANGAN
                </span>
              </div>
            </Container>
          </section>

          {/* 3. PRODUK KAMI (Featured Curated Products - 4 Item) */}
          <section className="py-16 sm:py-24">
            <Container>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-stone-200 dark:border-stone-800">
                <div>
                  <h2 className="font-sans text-2xl sm:text-3xl font-bold text-[#1f2421] dark:text-stone-100 tracking-tight">
                    Produk Kami
                  </h2>
                  <p className="font-sans text-sm text-stone-500 dark:text-stone-400 dark:text-stone-500 mt-1">
                    Pilihan komoditas jamur segar dan olahan siap pasok untuk operasional bisnis Anda.
                  </p>
                </div>
                <Link
                  href="/?katalog=semua"
                  className="font-sans text-sm font-semibold text-[#1b382b] dark:text-emerald-400 hover:underline flex items-center gap-1 shrink-0"
                >
                  Lihat Semua Produk ({totalCount}) &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
                {curatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    unit={product.unit}
                    stock={product.stock}
                    imageUrl={product.imageUrl}
                    categoryName={product.category.name}
                  />
                ))}
              </div>
            </Container>
          </section>

          {/* 4. KEUNGGULAN ETIRA (Numbered Editorial 01–04, No Large Cards) */}
          <section className="py-16 sm:py-24 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-[#141715]">
            <Container>
              <div className="max-w-2xl mb-14">
                <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[#1b382b] dark:text-emerald-400">
                  Standar Mutu
                </span>
                <h2 className="font-sans text-2xl sm:text-3xl font-bold text-[#1f2421] dark:text-stone-100 tracking-tight mt-2">
                  Komitmen pasokan pangan terpercaya
                </h2>
                <p className="font-sans text-sm text-stone-600 dark:text-stone-400 dark:text-stone-500 mt-2 leading-relaxed">
                  Dedikasi fasilitas perkebunan dataran tinggi dan pengolahan terpadu PT Eka Timur Raya di Pasuruan, Jawa Timur.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-12 border-t border-stone-200 dark:border-stone-800 pt-10">
                {/* 01 */}
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-bold text-[#1b382b] dark:text-emerald-400 tracking-wider mb-2">
                    01
                  </span>
                  <h3 className="font-sans font-bold text-lg text-[#1f2421] dark:text-stone-100 mb-2">
                    Budidaya Dataran Tinggi
                  </h3>
                  <p className="font-sans text-sm text-stone-600 dark:text-stone-400 dark:text-stone-500 leading-relaxed">
                    Fasilitas kebun berlokasi di kawasan sejuk Nongkojajar pada ketinggian 1.850 mdpl dengan iklim alami yang stabil untuk pertumbuhan jamur kancing prima.
                  </p>
                </div>

                {/* 02 */}
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-bold text-[#1b382b] dark:text-emerald-400 tracking-wider mb-2">
                    02
                  </span>
                  <h3 className="font-sans font-bold text-lg text-[#1f2421] dark:text-stone-100 mb-2">
                    Panen &amp; Seleksi Harian
                  </h3>
                  <p className="font-sans text-sm text-stone-600 dark:text-stone-400 dark:text-stone-500 leading-relaxed">
                    Jamur dipanen setiap pagi dan disortir secara bertahap berdasarkan ukuran serta keutuhan fisik untuk memenuhi standar spesifikasi dapur komersial.
                  </p>
                </div>

                {/* 03 */}
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-bold text-[#1b382b] dark:text-emerald-400 tracking-wider mb-2">
                    03
                  </span>
                  <h3 className="font-sans font-bold text-lg text-[#1f2421] dark:text-stone-100 mb-2">
                    Pengolahan Langsung Pabrik
                  </h3>
                  <p className="font-sans text-sm text-stone-600 dark:text-stone-400 dark:text-stone-500 leading-relaxed">
                    Fasilitas pengolahan jamur kaleng dan pouch retort steril langsung di Purwodadi Pasuruan memastikan kesegaran terkunci tanpa penurunan kualitas mutu.
                  </p>
                </div>

                {/* 04 */}
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-bold text-[#1b382b] dark:text-emerald-400 tracking-wider mb-2">
                    04
                  </span>
                  <h3 className="font-sans font-bold text-lg text-[#1f2421] dark:text-stone-100 mb-2">
                    Pasokan Rutin Horeka &amp; Industri
                  </h3>
                  <p className="font-sans text-sm text-stone-600 dark:text-stone-400 dark:text-stone-500 leading-relaxed">
                    Melayani kebutuhan volume pasokan berkelanjutan untuk mitra restoran, hotel, katering, pabrik olahan makanan, dan distributor di berbagai kota.
                  </p>
                </div>
              </div>
            </Container>
          </section>

          {/* 5. TENTANG PERUSAHAAN (Asymmetric Split Layout) */}
          <section className="py-16 sm:py-24 border-t border-stone-200 dark:border-stone-800">
            <Container>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                {/* Foto Fasilitas / Jamur */}
                <div className="lg:col-span-5">
                  <div className="relative aspect-[4/3] sm:aspect-[5/4] w-full rounded-lg overflow-hidden border border-stone-200 dark:border-stone-800/90 shadow-xs">
                    <Image
                      src="/hero-mushroom.jpg"
                      alt="Fasilitas dan komoditas PT Eka Timur Raya"
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover object-center"
                    />
                  </div>
                </div>

                {/* Narasi Profil */}
                <div className="lg:col-span-7 flex flex-col">
                  <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[#1b382b] dark:text-emerald-400 mb-2">
                    Tentang Etira Mushrooms
                  </span>
                  <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1f2421] dark:text-stone-100 tracking-tight mb-4">
                    PT Eka Timur Raya
                  </h2>
                  <p className="font-sans text-sm font-semibold text-stone-500 dark:text-stone-400 dark:text-stone-500 italic mb-4">
                    &quot;To Be One Stop Point for All Mushrooms Needs of The Customers.&quot;
                  </p>
                  <p className="font-sans text-sm sm:text-base text-stone-600 dark:text-stone-400 dark:text-stone-500 leading-relaxed mb-4">
                    Didirikan pada tahun 1999 di Purwodadi, Pasuruan, Jawa Timur, PT Eka Timur Raya bergerak dalam budidaya dan pengolahan jamur kancing berkualitas tinggi.
                  </p>
                  <p className="font-sans text-sm sm:text-base text-stone-600 dark:text-stone-400 dark:text-stone-500 leading-relaxed mb-8">
                    Dengan fasilitas terintegrasi dari perkebunan dataran tinggi Nongkojajar hingga lini pengolahan kaleng dan pouch steril, kami siap menjadi mitra penyedia pasokan jamur terpercaya untuk kebutuhan operasional bisnis Anda.
                  </p>

                  <div>
                    <Link
                      href="/tentang"
                      className="font-sans text-sm font-semibold text-[#1b382b] dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                    >
                      Selengkapnya tentang perusahaan &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </Container>
          </section>

          {/* 6. CALL TO ACTION (Tenang, Percaya Diri, Tanpa Hiasan) */}
          <section className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-[#141715] py-16 sm:py-20 text-center">
            <Container>
              <div className="max-w-2xl mx-auto flex flex-col items-center">
                <h2 className="font-sans text-2xl sm:text-3xl font-bold text-[#1f2421] dark:text-stone-100 tracking-tight mb-3">
                  Butuh pasokan jamur untuk bisnis Anda?
                </h2>
                <p className="font-sans text-sm sm:text-base text-stone-600 dark:text-stone-400 dark:text-stone-500 leading-relaxed mb-8 max-w-lg">
                  Diskusikan spesifikasi jamur, volume pengiriman rutin, dan penawaran harga pasokan bersama perwakilan kami.
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto mt-2">
                  <Link
                    href="/kontak"
                    className="bg-[#1b382b] dark:bg-[#204232] hover:bg-[#163024] dark:hover:bg-[#2a5742] text-white px-7 py-3 rounded-md font-medium text-sm transition-colors shadow-xs text-center sm:flex-none"
                  >
                    Hubungi Kami
                  </Link>
                  <Link
                    href="/?katalog=semua"
                    className="border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800/50 text-stone-800 dark:text-stone-200 px-7 py-3 rounded-md font-medium text-sm transition-colors text-center sm:flex-none"
                  >
                    Buka Katalog
                  </Link>
                </div>
              </div>
            </Container>
          </section>
        </>
      )}
    </div>
  );
}
