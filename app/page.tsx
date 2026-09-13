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
    <div className="flex flex-col gap-20 pb-24">
      {!isFiltering && (
        <>
          {/* Hero Section */}
          <section className="pt-8 sm:pt-12">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left */}
              <div className="flex flex-col justify-center">
                <span className="font-sans font-medium text-primary mb-4 block">PT Eka Timur Raya</span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-charcoal leading-[1.1] mb-6">
                  Pasokan Jamur Olahan Langsung dari Pabrik.
                </h1>

                <p className="text-lg font-sans text-charcoal-muted leading-relaxed mb-8 max-w-lg">
                  Kebutuhan jamur kancing segar, kaleng steril, dan pouch untuk industri kuliner nasional, restoran waralaba, serta katering.
                </p>

                <div className="flex items-center gap-4">
                  <a href="#katalog" className="btn-primary py-3.5 px-8 text-base">
                    Lihat Katalog
                  </a>
                </div>
              </div>

              {/* Right: Spotlight Product (Clean, no boxy card) */}
              {spotlightProduct && spotlightImage && (
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-bg-subtle group">
                  <Image
                    src={spotlightImage}
                    alt={spotlightProduct.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 text-white">
                    <p className="font-sans text-sm font-medium text-white/80 mb-1">{spotlightProduct.category?.name}</p>
                    <h3 className="font-heading text-2xl font-bold mb-2">
                      {spotlightProduct.name}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-xl font-bold">
                        {formatRupiah(spotlightProduct.price)}
                      </span>
                      <span className="font-sans text-sm text-white/80">
                        /{spotlightProduct.unit}
                      </span>
                    </div>
                  </div>
                  <Link href={`/produk/${spotlightProduct.id}`} className="absolute inset-0 z-10" aria-label={`Lihat ${spotlightProduct.name}`} />
                </div>
              )}
            </div>
          </section>

          {/* Featured Section */}
          {featuredProducts.length > 0 && (
            <section className="pt-8">
              <div className="flex items-baseline justify-between mb-8">
                <h2 className="font-heading text-2xl font-bold text-charcoal">
                  Produk Pilihan
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
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
      <section id="katalog" className="scroll-mt-24 pt-8 border-t border-border">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="font-heading text-3xl font-bold text-charcoal">
              Katalog Lengkap
            </h2>
          </div>

          {/* Search and Sort Form */}
          <form action="/" method="GET" className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {categoryId && <input type="hidden" name="kategori" value={categoryId} />}

            <div className="relative">
              <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Cari produk..."
                className="input pl-9 pr-4 py-2 text-sm w-full sm:w-64 bg-surface"
              />
            </div>

            <div className="relative">
              <select
                name="sort"
                defaultValue={sort}
                className="input pl-4 pr-10 py-2 text-sm appearance-none cursor-pointer w-full sm:w-48 bg-surface"
              >
                <option value="terbaru">Terbaru</option>
                <option value="harga-asc">Harga Terendah</option>
                <option value="harga-desc">Harga Tertinggi</option>
                <option value="nama-asc">A – Z</option>
              </select>
              <SlidersHorizontal className="w-3.5 h-3.5 text-charcoal-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button type="submit" className="btn-secondary py-2 px-6 text-sm">
              Cari
            </button>
          </form>
        </div>

        {/* Clean Category Links */}
        <div className="flex flex-wrap gap-2 mb-10 font-sans text-base">
          <a
            href={
              q || sort !== "terbaru"
                ? `/?${q ? `q=${encodeURIComponent(q)}&` : ""}${sort !== "terbaru" ? `sort=${sort}` : ""}#katalog`
                : "/#katalog"
            }
            className={`px-5 py-2 rounded-full transition-colors ${
              !categoryId
                ? "bg-charcoal text-white font-medium"
                : "bg-surface text-charcoal-muted hover:bg-border hover:text-charcoal"
            }`}
          >
            Semua
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
                className={`px-5 py-2 rounded-full transition-colors ${
                  isActive
                    ? "bg-charcoal text-white font-medium"
                    : "bg-surface text-charcoal-muted hover:bg-border hover:text-charcoal"
                }`}
              >
                {cat.name}
              </a>
            );
          })}
        </div>
        
        <PaginationControls currentPage={page} totalPages={totalPages} />

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 mt-10">
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
            action={{ label: "Kembali ke Katalog", href: "/#katalog" }}
          />
        )}
      </section>
    </div>
  );
}
