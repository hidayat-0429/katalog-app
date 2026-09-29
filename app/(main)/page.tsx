import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { getServerMessages } from "@/lib/serverMessages";
import HomePageClient from "./HomePageClient";

type ProductWithCategory = Prisma.ProductGetPayload<{ include: { category: true } }>;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerMessages();
  return { title: t.metadata.default, description: t.metadata.homeDescription };
}

const LIMIT = 12;

// Tiap perjalanan ke database remote butuh ±175 ms, jadi data beranda — yang
// isinya sama untuk semua pengunjung — diambil dari cache. Aksi produk,
// kategori, dan pesanan memanggil revalidateTag("beranda") saat mengubah data.
const getHomeHighlights = unstable_cache(
  async () => {
    const [totalCount, products, featuredProducts] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.findMany({
        where: { isActive: true },
        include: { category: true },
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
      prisma.product.findMany({
        where: { isActive: true, isFeatured: true },
        include: { category: true },
        take: 4,
      }),
    ]);
    return { totalCount, products, featuredProducts };
  },
  ["home-highlights"],
  { revalidate: 120, tags: ["beranda"] }
);

const getCategories = unstable_cache(
  () => prisma.category.findMany({ orderBy: { name: "asc" } }),
  ["product-categories"],
  { revalidate: 600, tags: ["beranda"] }
);

// Mode katalog punya hasil berbeda per kombinasi filter + halaman, jadi tidak di-cache.
function fetchCatalogPage(where: Prisma.ProductWhereInput, page: number) {
  return prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * LIMIT,
    take: LIMIT,
  });
}

async function loadCatalogPage(where: Prisma.ProductWhereInput, rawPage?: string) {
  const parsed = Number(rawPage);
  const requestedPage = Number.isInteger(parsed) && parsed > 0 ? parsed : 1;

  // Jumlah dan isi halaman diambil bersamaan supaya hanya sekali perjalanan ke
  // database. Halaman minta yang ternyata di luar jangkauan diambil ulang —
  // itu cuma terjadi kalau angka halaman diketik manual terlalu besar.
  const [totalCount, products] = await Promise.all([
    prisma.product.count({ where }),
    fetchCatalogPage(where, requestedPage),
  ]);

  const totalPages = Math.max(Math.ceil(totalCount / LIMIT), 1);
  const safePage = Math.min(requestedPage, totalPages);

  return {
    totalCount,
    totalPages,
    safePage,
    products:
      safePage === requestedPage ? products : await fetchCatalogPage(where, safePage),
  };
}

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
  // Pembeli berbahasa Inggris mengetik "frozen", bukan "beku" — cari di kedua nama.
  if (q) {
    const matches = { contains: q, mode: "insensitive" as const };
    whereClause.OR = [{ name: matches }, { nameEn: matches }];
  }

  const [categories, data] = await Promise.all([
    getCategories(),
    isCatalogMode
      ? loadCatalogPage(whereClause, resolvedSearchParams.page).then((d) => ({
          ...d,
          featuredProducts: [] as ProductWithCategory[],
        }))
      : getHomeHighlights().then((d) => ({ ...d, safePage: 1, totalPages: 1 })),
  ]);

  const curatedProducts =
    data.featuredProducts.length > 0 ? data.featuredProducts : data.products.slice(0, 4);

  return (
    <HomePageClient
      isCatalogMode={isCatalogMode}
      categories={categories}
      products={data.products}
      curatedProducts={curatedProducts}
      totalCount={data.totalCount}
      safePage={data.safePage}
      totalPages={data.totalPages}
      q={q}
      categoryId={categoryId}
    />
  );
}
