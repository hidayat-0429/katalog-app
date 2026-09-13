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
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-charcoal">Kelola Produk</h1>
          <p className="font-sans text-xs sm:text-sm text-charcoal-muted mt-0.5">
            Tambah, perbarui harga, dan atur stok persediaan produk
          </p>
        </div>
        <Link href="/admin/produk/baru" className="btn-primary inline-flex items-center gap-1.5 self-start sm:self-auto py-2 px-4">
          <Plus className="w-4 h-4" />
          <span>Tambah Produk</span>
        </Link>
      </div>

      <div className="card p-0 overflow-hidden font-sans">
        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-bg-subtle border-b border-border text-charcoal-muted uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4 font-semibold">Produk</th>
                  <th className="p-4 font-semibold">Kategori</th>
                  <th className="p-4 font-semibold">Harga</th>
                  <th className="p-4 font-semibold">Stok</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-bg-subtle/50 transition-colors">
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-bg-subtle border border-border rounded-md flex items-center justify-center shrink-0 overflow-hidden relative text-charcoal-muted">
                          {product.imageUrl ? (
                            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                          ) : (
                            <Package className="w-5 h-5" />
                          )}
                        </div>
                        <div className="font-semibold text-charcoal">{product.name}</div>
                      </div>
                    </td>
                    <td className="p-4 align-middle text-charcoal-muted">{product.category?.name || '-'}</td>
                    <td className="p-4 align-middle font-mono font-medium text-charcoal">
                      {formatRupiah(product.price)}
                      <span className="font-sans text-charcoal-muted font-normal text-xs ml-1">/{product.unit}</span>
                    </td>
                    <td className="p-4 align-middle font-mono text-charcoal-muted">{product.stock}</td>
                    <td className="p-4 align-middle">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                        product.isActive 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : 'bg-bg-subtle text-charcoal-muted border border-border'
                      }`}>
                        {product.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/produk/${product.id}`}
                          className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
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
          <div className="p-8 text-center text-charcoal-muted text-xs">
            Belum ada produk terdaftar. Klik tombol Tambah Produk untuk membuat.
          </div>
        )}
      </div>
    </div>
  )
}
