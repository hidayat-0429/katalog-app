import { prisma } from '@/lib/prisma'
import { createCategory } from '@/lib/actions/categories'
import { Plus, Tag } from 'lucide-react'
import DeleteCategoryButton from './DeleteCategoryButton'
import EditCategoryButton from './EditCategoryButton'
import { Button, Input } from '@/components/ui'

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
    <div className="space-y-6 text-neutral-900 dark:text-neutral-100">
      <div>
        <h1 className="font-display text-xl sm:text-3xl font-bold tracking-tight">Kelola Kategori</h1>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Kelompokkan produk berdasarkan jenis komoditas dan kemasan
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_2fr] gap-6 items-start">
        {/* Add Form */}
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-5 sticky top-20">
          <h2 className="flex items-center gap-2 font-semibold text-sm text-neutral-900 dark:text-neutral-100 mb-3 border-b border-neutral-200 dark:border-neutral-700 pb-2">
            <Plus className="w-4 h-4 text-neutral-900 dark:text-neutral-100" />
            <span>Tambah Kategori</span>
          </h2>
          <form action={handleCreate} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label htmlFor="name" className="font-medium text-neutral-900 dark:text-neutral-100">Nama Kategori</label>
              <Input type="text" id="name" name="name" required className="w-full text-xs" placeholder="Contoh: Jamur Segar / Pouch" />
            </div>
            <div className="space-y-1">
              <label htmlFor="description" className="font-medium text-neutral-900 dark:text-neutral-100">Keterangan (Opsional)</label>
              <textarea id="description" name="description" className="input w-full min-h-[70px] text-xs" placeholder="Deskripsi singkat jenis produk..." />
            </div>
            <Button type="submit" variant="primary" className="w-full inline-flex items-center justify-center gap-1.5 py-2">
              <Plus className="w-3.5 h-3.5" />
              <span>Simpan Kategori</span>
            </Button>
          </form>
        </div>

        {/* Category List */}
        <div className="flex flex-col gap-2.5">
          {categories.map(category => (
            <div key={category.id} className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4 flex items-center justify-between group hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded flex items-center justify-center shrink-0 text-neutral-500 dark:text-neutral-400">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">{category.name}</div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">
                    <span className="font-mono tabular-nums">{category._count.products}</span> produk terdaftar
                    {category.description && (
                      <span className="ml-2 italic"> {category.description}</span>
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
            <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-8 text-center text-neutral-500 dark:text-neutral-400 text-xs">
              Belum ada kategori yang dibuat.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
