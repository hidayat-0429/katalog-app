import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import HomePageClient from "./HomePageClient";

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
    <HomePageClient
      isCatalogMode={isCatalogMode}
      categories={categories}
      products={products}
      curatedProducts={curatedProducts}
      totalCount={totalCount}
      safePage={safePage}
      totalPages={totalPages}
      q={q}
      categoryId={categoryId}
    />
  );
}
