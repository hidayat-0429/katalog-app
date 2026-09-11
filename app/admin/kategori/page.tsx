import { prisma } from '@/lib/prisma'
import { createCategory } from '@/lib/actions/categories'
import { Plus, Tag } from 'lucide-react'
import DeleteCategoryButton from './DeleteCategoryButton'
import EditCategoryButton from './EditCategoryButton'

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  async function handleCreate(formData: FormData) {
    "use server";
    await createCategory(formData);
  }

  return (
    <div className="space-y-6 text-charcoal dark:text-dark-text">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Kelola Kategori</h1>
        <p className="text-xs sm:text-sm text-charcoal-muted dark:text-dark-muted mt-0.5">
          Kelompokkan produk berdasarkan jenis komoditas dan kemasan
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_2fr] gap-6 items-start">
        {/* Add Form */}
        <div className="card p-5 sticky top-20">
          <h2 className="flex items-center gap-2 font-bold text-sm text-charcoal dark:text-dark-text mb-3 border-b border-border dark:border-dark-border pb-2">
            <Plus className="w-4 h-4 text-charcoal dark:text-dark-text" />
            <span>Tambah Kategori</span>
          </h2>
          <form action={handleCreate} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label htmlFor="name" className="font-medium text-charcoal dark:text-dark-text">Nama Kategori</label>
              <input type="text" id="name" name="name" required className="input w-full text-xs" placeholder="Contoh: Jamur Segar / Pouch" />
            </div>
            <div className="space-y-1">
              <label htmlFor="description" className="font-medium text-charcoal dark:text-dark-text">Keterangan (Opsional)</label>
              <textarea id="description" name="description" className="input w-full min-h-[70px] text-xs" placeholder="Deskripsi singkat jenis produk..." />
            </div>
            <button type="submit" className="btn-primary w-full inline-flex items-center justify-center gap-1.5 py-2">
              <Plus className="w-3.5 h-3.5" />
              <span>Simpan Kategori</span>
            </button>
          </form>
        </div>

        {/* Category List */}
        <div className="flex flex-col gap-2.5">
          {categories.map(category => (
            <div key={category.id} className="card p-4 flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-bg-subtle dark:bg-dark-bg-subtle border border-border dark:border-dark-border rounded flex items-center justify-center shrink-0 text-charcoal-muted dark:text-dark-muted">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-charcoal dark:text-dark-text">{category.name}</div>
                  <div className="text-xs text-charcoal-muted dark:text-dark-muted">
                    {category._count.products} produk terdaftar
                    {category.description && (
                      <span className="ml-2 italic">— {category.description}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <EditCategoryButton
                  id={category.id}
                  currentName={category.name}
                  currentDescription={category.description}
                />
                <DeleteCategoryButton id={category.id} disabled={category._count.products > 0} />
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="card p-8 text-center text-charcoal-muted dark:text-dark-muted text-xs">
              Belum ada kategori yang dibuat.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
