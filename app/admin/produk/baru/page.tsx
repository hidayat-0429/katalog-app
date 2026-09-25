import { prisma } from '@/lib/prisma'
import { createProduct } from '@/lib/actions/products'
import ProductForm from '../ProductForm'
import Link from 'next/link'
import { ArrowLeft, ChevronRight } from 'lucide-react'

export default async function NewProductPage() {
  const categories = await prisma.category.findMany()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <nav className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          <Link href="/admin/produk" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">Produk</Link>
          <ChevronRight className="w-3 h-3 text-neutral-400 dark:text-neutral-600" />
          <span className="text-neutral-900 dark:text-neutral-100 font-medium">Tambah Baru</span>
        </nav>
        <Link
          href="/admin/produk"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-150 ease-out border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-1.5 hover:border-neutral-300 dark:hover:border-neutral-600"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali
        </Link>
      </div>
      <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Tambah Produk</h1>
      
      <ProductForm categories={categories} action={createProduct} />
    </div>
  )
}

