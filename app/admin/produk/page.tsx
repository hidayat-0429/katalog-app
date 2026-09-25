import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/format";
import Link from "next/link";
import { Plus, Package, Pencil } from "lucide-react";
import DeleteProductButton from "./DeleteProductButton";
import Image from "next/image";
import {
  Button,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui";

const ITEMS_PER_PAGE = 15;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;
  const currentPage = Number(page) || 1;
  const search = q?.trim() || "";

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { category: { name: { contains: search, mode: "insensitive" as const } } },
        ],
      }
    : {};

  const [totalCount, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Kelola Produk
          </h1>
          <p className="font-sans text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
            {totalCount} produk terdaftar
          </p>
        </div>
        <Link href="/admin/produk/baru" className="self-start sm:self-auto">
          <Button
            variant="primary"
            className="inline-flex items-center gap-1.5 py-2 px-4"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk</span>
          </Button>
        </Link>
      </div>

      {/* Search */}
      <form method="GET" action="/admin/produk" className="flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={search}
          placeholder="Cari nama produk atau kategori..."
          aria-label="Cari nama produk atau kategori"
          className="input flex-1 text-sm py-1.5"
        />
        <Button type="submit" variant="secondary" className="py-1.5 px-4 text-sm">
          Cari
        </Button>
        {search && (
          <Link href="/admin/produk">
            <Button variant="secondary" className="py-1.5 px-4 text-sm">
              Reset
            </Button>
          </Link>
        )}
      </form>

      <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden bg-white dark:bg-neutral-800">
        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell header>Produk</TableCell>
                  <TableCell header>Kategori</TableCell>
                  <TableCell header>Harga</TableCell>
                  <TableCell header>Stok</TableCell>
                  <TableCell header>Status</TableCell>
                  <TableCell header className="text-right">
                    Aksi
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md flex items-center justify-center shrink-0 overflow-hidden relative text-neutral-400 dark:text-neutral-500">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover"
                              unoptimized={product.imageUrl.startsWith("http")}
                            />
                          ) : (
                            <Package className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                            {product.name}
                          </div>
                          {product.isFeatured && (
                            <span className="text-[10px] font-medium text-brand-forest-600 dark:text-brand-forest-400">
                              ★ Produk Pilihan
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-neutral-600 dark:text-neutral-400">
                      {product.category?.name || "-"}
                    </TableCell>
                    <TableCell numeric>
                      {formatRupiah(product.price)}
                      <span className="font-sans text-neutral-500 dark:text-neutral-400 font-normal text-xs ml-1">
                        /{product.unit}
                      </span>
                    </TableCell>
                    <TableCell numeric>
                      {product.stock}
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.isActive ? "success" : "default"}>
                        {product.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/produk/${product.id}`}>
                          <Button
                            variant="secondary"
                            className="py-1.5 px-3 text-xs flex items-center gap-1.5"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </Button>
                        </Link>
                        <DeleteProductButton id={product.id} name={product.name} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-8 text-center text-neutral-500 dark:text-neutral-400 text-xs">
            {search
              ? `Tidak ada produk yang cocok dengan pencarian "${search}".`
              : "Belum ada produk terdaftar. Klik tombol Tambah Produk untuk membuat."}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between font-sans text-sm">
          <span className="text-xs text-neutral-600 dark:text-neutral-400">
            Halaman {currentPage} dari {totalPages} ({totalCount} produk)
          </span>
          <div className="flex gap-2">
            {currentPage > 1 && (
              <Link
                href={`/admin/produk?${new URLSearchParams({
                  ...(search ? { q: search } : {}),
                  page: String(currentPage - 1),
                }).toString()}`}
              >
                <Button variant="secondary" className="py-1.5 px-3 text-xs">
                   Sebelumnya
                </Button>
              </Link>
            )}
            {currentPage < totalPages && (
              <Link
                href={`/admin/produk?${new URLSearchParams({
                  ...(search ? { q: search } : {}),
                  page: String(currentPage + 1),
                }).toString()}`}
              >
                <Button variant="secondary" className="py-1.5 px-3 text-xs">
                  Berikutnya →
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
