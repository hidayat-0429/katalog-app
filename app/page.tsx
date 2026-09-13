import { Search, SlidersHorizontal } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";
import PaginationControls from "@/components/PaginationControls";
import Image from "next/image";
import { formatRupiah } from "@/lib/format";
import { getProductPlaceholderImage, getMinOrderText } from "@/lib/productImage";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { kategori?: string; q?: string; sort?: string; page?: string };
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

  const page = Number(searchParams.page) || 1;
  const limit = 12;
  const skip = (page - 1) * limit;

  const totalCount = await prisma.product.count({ where: whereClause });
  const totalPages = Math.ceil(totalCount / limit);

  const [categories, products, featuredProducts] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: whereClause,
      include: { category: true },
      orderBy: orderByClause,
      skip,
      take: limit,
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
    <div className="flex flex-col gap-14 sm:gap-20 pb-20">
      {!isFiltering && (
        <>
          {/* Hero Section */}
          <section className="pt-2 sm:pt-4">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-sans font-medium tracking-wide w-fit mb-5">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span>PT Eka Timur Raya • Produsen Jamur Terintegrasi Pasuruan</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-charcoal leading-[1.1] mb-5">
                  Pasokan Jamur Segar &amp; Olahan Steril Langsung dari Pabrik.
                </h1>

                <p className="text-base sm:text-lg font-sans text-charcoal-muted leading-relaxed mb-8 max-w-xl">
                  Etira Mushrooms menyediakan pasokan terpercaya jamur kancing segar, olahan kaleng steril, pouch retort, dan jamur beku untuk industri kuliner, restoran waralaba, dan katering nasional.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <a href="#katalog" className="btn-primary py-3 px-6 text-sm">
                    Jelajahi Katalog Komoditas
                  </a>
                  <Link href="/register" className="btn-secondary py-3 px-6 text-sm">
                    Registrasi Klien B2B
                  </Link>
                </div>

                {/* Reassurance line */}
                <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center gap-4 text-xs font-sans font-medium text-charcoal-muted">
                  <span className="flex items-center gap-1.5 text-charcoal font-semibold">
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

              {/* Right */}
              {spotlightProduct && spotlightImage && (
                <div className="lg:col-span-5">
                  <Link
                    href={`/produk/${spotlightProduct.id}`}
                    className="group block bg-surface border border-border rounded-lg overflow-hidden hover:border-charcoal transition-colors duration-150"
                  >
                    <div className="relative aspect-[4/3] w-full bg-bg-subtle overflow-hidden border-b border-border">
                      <Image
                        src={spotlightImage}
                        alt={spotlightProduct.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        priority
                      />
                    </div>

                    <div className="p-5">
                      <div className="flex items-center justify-between text-xs font-sans text-charcoal-muted mb-2">
                        <span>Pilihan Utama Pekan Ini</span>
                        <span className="uppercase tracking-wider font-semibold">{spotlightProduct.category?.name}</span>
                      </div>

                      <h3 className="font-heading text-lg sm:text-xl font-bold text-charcoal leading-snug group-hover:text-primary transition-colors">
                        {spotlightProduct.name}
                      </h3>

                      <div className="mt-4 pt-4 border-t border-border flex items-baseline justify-between">
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="font-mono text-xl sm:text-2xl font-bold text-charcoal">
                              {formatRupiah(spotlightProduct.price)}
                            </span>
                            <span className="font-sans text-sm text-charcoal-muted">
                              /{spotlightProduct.unit}
                            </span>
                          </div>
                          <span className="font-sans text-xs text-charcoal-muted">
                            {spotlightMinOrder}
                          </span>
                        </div>

                        <span className="font-sans text-xs font-semibold text-charcoal flex items-center gap-1">
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
              <div className="flex items-baseline justify-between mb-6 pb-2 border-b border-border">
                <h2 className="font-heading text-xl font-bold text-charcoal">
                  Produk Pilihan
                </h2>
                <a
                  href="#katalog"
                  className="font-sans text-xs font-medium text-charcoal-muted hover:text-charcoal transition-colors"
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
        
      </>) }

      {/* Main Catalog Section */}
      <section id="katalog" className="scroll-mt-20">
        <div className="border-b border-border pb-5 mb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-charcoal">
                Daftar Produk
              </h2>
              <p className="font-sans text-sm text-charcoal-muted mt-1">
                Tersedia {products.length} komoditas dan kemasan olahan.
              </p>
            </div>

            {/* Search and Sort Form */}
            <form action="/" method="GET" className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {categoryId && <input type="hidden" name="kategori" value={categoryId} />}

              <div className="relative">
                <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  name="q"
                  defaultValue={q}
                  placeholder="Cari produk..."
                  className="input pl-9 pr-3 py-1.5 text-xs sm:text-sm w-full sm:w-56"
                />
              </div>

              <div className="relative">
                <SlidersHorizontal className="w-3.5 h-3.5 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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

              <button type="submit" className="btn-secondary py-1.5 px-4 text-sm">
                Filter
              </button>
            </form>
          </div>

          {/* Clean Category Links */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 font-sans text-sm">
            <a
              href={
                q || sort !== "terbaru"
                  ? `/?${q ? `q=${encodeURIComponent(q)}&` : ""}${sort !== "terbaru" ? `sort=${sort}` : ""}#katalog`
                  : "/#katalog"
              }
              className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap text-sm font-medium border ${
                !categoryId
                  ? "bg-charcoal text-white border-charcoal"
                  : "bg-transparent text-charcoal-muted border-transparent hover:text-charcoal hover:bg-bg-subtle"
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
                  className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap text-sm font-medium border ${
                    isActive
                      ? "bg-charcoal text-white border-charcoal"
                      : "bg-transparent text-charcoal-muted border-transparent hover:text-charcoal hover:bg-bg-subtle"
                  }`}
                >
                  {cat.name}
                </a>
              );
            })}
        </div>
        <PaginationControls currentPage={page} totalPages={totalPages} />
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
