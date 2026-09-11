import { Search, SlidersHorizontal } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";
import Image from "next/image";
import { formatRupiah } from "@/lib/format";
import { getProductPlaceholderImage, getMinOrderText } from "@/lib/productImage";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { kategori?: string; q?: string; sort?: string };
}) {
  const q = searchParams.q || "";
  const categoryId = searchParams.kategori || "";
  const sort = searchParams.sort || "terbaru";

  const isFiltering = q.length > 0 || categoryId.length > 0 || (sort && sort !== "terbaru");

  const whereClause: any = { isActive: true };
  if (categoryId) {
    whereClause.categoryId = categoryId;
  }
  if (q) {
    whereClause.name = { contains: q, mode: "insensitive" };
  }

  let orderByClause: any = { createdAt: "desc" };
  if (sort === "harga-asc") {
    orderByClause = { price: "asc" };
  } else if (sort === "harga-desc") {
    orderByClause = { price: "desc" };
  } else if (sort === "nama-asc") {
    orderByClause = { name: "asc" };
  }

  const [categories, products, featuredProducts] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: whereClause,
      include: { category: true },
      orderBy: orderByClause,
    }),
    !isFiltering
      ? prisma.product.findMany({
          where: { isActive: true, isFeatured: true },
          include: { category: true },
          take: 4,
        })
      : Promise.resolve([]),
  ]);

  const spotlightProduct = featuredProducts[0] || products[0];
  const spotlightImage = spotlightProduct
    ? spotlightProduct.imageUrl || getProductPlaceholderImage(spotlightProduct.name, spotlightProduct.category?.name)
    : null;
  const spotlightMinOrder = spotlightProduct ? getMinOrderText(spotlightProduct.unit) : "";

  return (
    <div className="flex flex-col gap-14 sm:gap-20 pb-20 text-charcoal dark:text-dark-text">
      {!isFiltering && (
        <>
          {/* Hero Section: Simple, confident, focused */}
          <section className="pt-2 sm:pt-4">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left: Headline, description, action */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage/10 text-sage dark:text-dark-sage text-xs font-semibold tracking-wide w-fit mb-4 border border-sage/20">
                  <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />
                  <span>PT Eka Timur Raya • Produsen Jamur Terintegrasi Pasuruan</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-charcoal dark:text-dark-text leading-[1.12] mb-5">
                  Pasokan Jamur Segar &amp; Olahan Steril Langsung dari Pabrik.
                </h1>

                <p className="text-base sm:text-lg text-charcoal-muted dark:text-dark-muted leading-relaxed mb-8 max-w-xl">
                  Etira Mushrooms menyediakan pasokan terpercaya jamur kancing segar, olahan kaleng steril, pouch retort, dan jamur beku untuk industri kuliner, restoran waralaba, dan katering nasional.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <a href="#katalog" className="btn-primary py-3 px-5 text-sm font-semibold rounded-lg shadow-sm">
                    Jelajahi Katalog Komoditas
                  </a>
                  <Link href="/register" className="btn-secondary py-3 px-5 text-sm font-semibold rounded-lg">
                    Registrasi Klien B2B
                  </Link>
                </div>

                {/* Reassurance line */}
                <div className="mt-8 pt-6 border-t border-border dark:border-dark-border flex flex-wrap items-center gap-4 text-xs font-medium text-charcoal-muted dark:text-dark-muted">
                  <span className="flex items-center gap-1.5 text-charcoal dark:text-dark-text font-semibold">
                    ✓ Panen Hari yang Sama
                  </span>
                  <span>•</span>
                  <span>Standar Pengolahan Steril</span>
                  <span>•</span>
                  <span>Faktur Resmi Siap Cetak</span>
                  <span>•</span>
                  <span>Armada Berpendingin</span>
                </div>
              </div>

              {/* Right: One bold spotlight product photo */}
              {spotlightProduct && spotlightImage && (
                <div className="lg:col-span-5">
                  <Link
                    href={`/produk/${spotlightProduct.id}`}
                    className="group block bg-bg-subtle dark:bg-dark-surface border border-border dark:border-dark-border rounded-xl overflow-hidden hover:border-charcoal dark:hover:border-dark-text transition-colors duration-150"
                  >
                    <div className="relative aspect-[4/3] w-full bg-white dark:bg-dark-bg overflow-hidden border-b border-border dark:border-dark-border">
                      <Image
                        src={spotlightImage}
                        alt={spotlightProduct.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover"
                        priority
                      />
                    </div>

                    <div className="p-5">
                      <div className="flex items-center justify-between text-xs text-charcoal-muted dark:text-dark-muted mb-1">
                        <span>Pilihan Utama Pekan Ini</span>
                        <span>{spotlightProduct.category?.name}</span>
                      </div>

                      <h3 className="text-lg font-bold text-charcoal dark:text-dark-text leading-snug group-hover:underline">
                        {spotlightProduct.name}
                      </h3>

                      <div className="mt-3 pt-3 border-t border-border-subtle dark:border-dark-border/60 flex items-baseline justify-between">
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-charcoal dark:text-dark-text">
                              {formatRupiah(spotlightProduct.price)}
                            </span>
                            <span className="text-xs text-charcoal-muted dark:text-dark-muted">
                              /{spotlightProduct.unit}
                            </span>
                          </div>
                          <span className="text-xs text-charcoal-muted dark:text-dark-muted">
                            {spotlightMinOrder}
                          </span>
                        </div>

                        <span className="text-xs font-semibold text-charcoal dark:text-dark-text">
                          Rincian &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* Featured Section: Calm & Direct */}
          {featuredProducts.length > 0 && (
            <section>
              <div className="flex items-baseline justify-between mb-6 pb-2 border-b border-border dark:border-dark-border">
                <h2 className="text-xl font-bold text-charcoal dark:text-dark-text">
                  Produk Pilihan
                </h2>
                <a
                  href="#katalog"
                  className="text-xs font-medium text-charcoal-muted dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text transition-colors"
                >
                  Lihat semua ({products.length})
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
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
            </section>
          )}
        </>
      )}

      {/* Main Catalog Section */}
      <section id="katalog" className="scroll-mt-20">
        <div className="border-b border-border dark:border-dark-border pb-5 mb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-charcoal dark:text-dark-text">
                Daftar Produk
              </h2>
              <p className="text-sm text-charcoal-muted dark:text-dark-muted mt-1">
                Tersedia {products.length} komoditas dan kemasan olahan.
              </p>
            </div>

            {/* Search and Sort Form */}
            <form action="/" method="GET" className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {categoryId && <input type="hidden" name="kategori" value={categoryId} />}

              <div className="relative">
                <Search className="w-4 h-4 text-charcoal-muted dark:text-dark-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  name="q"
                  defaultValue={q}
                  placeholder="Cari produk..."
                  className="input pl-9 pr-3 py-1.5 text-xs sm:text-sm w-full sm:w-56"
                />
              </div>

              <div className="relative">
                <SlidersHorizontal className="w-3.5 h-3.5 text-charcoal-muted dark:text-dark-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  name="sort"
                  defaultValue={sort}
                  className="input pl-8 pr-6 py-1.5 text-xs sm:text-sm appearance-none cursor-pointer w-full sm:w-44"
                >
                  <option value="terbaru">Terbaru</option>
                  <option value="harga-asc">Harga: Rendah ke Tinggi</option>
                  <option value="harga-desc">Harga: Tinggi ke Rendah</option>
                  <option value="nama-asc">Nama: A – Z</option>
                </select>
              </div>

              <button type="submit" className="btn-primary py-1.5 px-3 text-xs">
                Filter
              </button>
            </form>
          </div>

          {/* Clean Category Links (Text tabs instead of AI code pills) */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 text-sm">
            <a
              href={
                q || sort !== "terbaru"
                  ? `/?${q ? `q=${encodeURIComponent(q)}&` : ""}${sort !== "terbaru" ? `sort=${sort}` : ""}#katalog`
                  : "/#katalog"
              }
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap text-xs font-medium ${
                !categoryId
                  ? "bg-charcoal text-white dark:bg-dark-cta dark:text-dark-cta-text"
                  : "text-charcoal-muted dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text hover:bg-bg-subtle dark:hover:bg-dark-surface"
              }`}
            >
              Semua Kategori
            </a>

            {categories.map((cat) => {
              const params = new URLSearchParams();
              params.set("kategori", cat.id);
              if (q) params.set("q", q);
              if (sort && sort !== "terbaru") params.set("sort", sort);

              const isActive = categoryId === cat.id;

              return (
                <a
                  key={cat.id}
                  href={`/?${params.toString()}#katalog`}
                  className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap text-xs font-medium ${
                    isActive
                      ? "bg-charcoal text-white dark:bg-dark-cta dark:text-dark-cta-text"
                      : "text-charcoal-muted dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text hover:bg-bg-subtle dark:hover:bg-dark-surface"
                  }`}
                >
                  {cat.name}
                </a>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
            description="Tidak ada produk yang sesuai dengan pencarian atau filter yang dipilih."
            action={{ label: "Lihat Semua Produk", href: "/#katalog" }}
          />
        )}
      </section>
    </div>
  );
}
