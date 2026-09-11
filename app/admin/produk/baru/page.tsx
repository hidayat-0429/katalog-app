import { prisma } from '@/lib/prisma'
import { createProduct } from '@/lib/actions/products'
import ProductForm from '../ProductForm'
import Link from 'next/link'

export default async function NewProductPage() {
  const categories = await prisma.category.findMany()

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="text-sm text-stone-500 flex items-center gap-2">
        <Link href="/admin/produk" className="hover:text-forest">Produk</Link>
        <span>&gt;</span>
        <span>Tambah Baru</span>
      </div>
      <h1 className="section-title">Tambah Produk</h1>
      
      <ProductForm categories={categories} action={createProduct} />
    </div>
  )
}
