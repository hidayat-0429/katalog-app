import { prisma } from '@/lib/prisma'
import { formatRupiah } from '@/lib/format'
import Link from 'next/link'
import { Plus, Package, Pencil } from 'lucide-react'
import DeleteProductButton from './DeleteProductButton'
import Image from 'next/image'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-5 text-charcoal dark:text-dark-text">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Kelola Produk</h1>
          <p className="text-xs sm:text-sm text-charcoal-muted dark:text-dark-muted mt-0.5">
            Tambah, perbarui harga, dan atur stok persediaan produk
          </p>
        </div>
        <Link href="/admin/produk/baru" className="btn-primary inline-flex items-center gap-1.5 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          <span>Tambah Produk</span>
        </Link>
      </div>

      <div className="card p-0 overflow-hidden">
        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-bg-subtle dark:bg-dark-bg-subtle border-b border-border dark:border-dark-border text-charcoal-muted dark:text-dark-muted">
                <tr>
                  <th className="p-3.5 font-semibold">Produk</th>
                  <th className="p-3.5 font-semibold">Kategori</th>
                  <th className="p-3.5 font-semibold">Harga</th>
                  <th className="p-3.5 font-semibold">Stok</th>
                  <th className="p-3.5 font-semibold">Status</th>
                  <th className="p-3.5 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-dark-border">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-bg-subtle/50 dark:hover:bg-dark-surface/50 transition-colors">
                    <td className="p-3.5 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-bg-subtle dark:bg-dark-bg-subtle border border-border dark:border-dark-border rounded flex items-center justify-center shrink-0 overflow-hidden relative text-charcoal-muted dark:text-dark-muted">
                          {product.imageUrl ? (
                            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                          ) : (
                            <Package className="w-4 h-4" />
                          )}
                        </div>
                        <div className="font-semibold text-charcoal dark:text-dark-text">{product.name}</div>
                      </div>
                    </td>
                    <td className="p-3.5 align-middle text-charcoal-muted dark:text-dark-muted">{product.category?.name || '-'}</td>
                    <td className="p-3.5 align-middle font-medium text-charcoal dark:text-dark-text">
                      {formatRupiah(product.price)}
                      <span className="text-charcoal-muted dark:text-dark-muted font-normal text-xs ml-1">/{product.unit}</span>
                    </td>
                    <td className="p-3.5 align-middle text-charcoal-muted dark:text-dark-muted">{product.stock}</td>
                    <td className="p-3.5 align-middle">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        product.isActive 
                          ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40' 
                          : 'bg-bg-subtle text-charcoal-muted border border-border dark:border-dark-border'
                      }`}>
                        {product.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="p-3.5 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/produk/${product.id}`}
                          className="btn-secondary py-1 px-2 text-xs flex items-center gap-1"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Link>
                        <DeleteProductButton id={product.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-charcoal-muted dark:text-dark-muted text-xs">
            Belum ada produk terdaftar. Klik tombol Tambah Produk untuk membuat.
          </div>
        )}
      </div>
    </div>
  )
}
