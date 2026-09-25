import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { updateProduct } from '@/lib/actions/products'
import ProductForm from '../ProductForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id }
  })

  if (!product) {
    notFound()
  }

  const categories = await prisma.category.findMany()
  const updateProductWithId = updateProduct.bind(null, product.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <nav className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          <Link href="/admin/produk" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">Produk</Link>
          <span>/</span>
          <span className="text-neutral-900 dark:text-neutral-100 font-medium truncate max-w-[200px]">Edit: {product.name}</span>
        </nav>
        <Link
          href="/admin/produk"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors duration-150 ease-out border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-1.5 hover:border-neutral-300 dark:hover:border-neutral-600 shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali
        </Link>
      </div>
      <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Edit Produk</h1>
      
      <ProductForm categories={categories} product={product} action={updateProductWithId} />
    </div>
  )
}
