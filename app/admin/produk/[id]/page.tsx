import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { updateProduct } from '@/lib/actions/products'
import ProductForm from '../ProductForm'
import Link from 'next/link'

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
    <div className="space-y-6 animate-fade-in-up">
      <div className="text-sm text-stone-500 flex items-center gap-2">
        <Link href="/admin/produk" className="hover:text-forest">Produk</Link>
        <span>&gt;</span>
        <span>Edit: {product.name}</span>
      </div>
      <h1 className="section-title">Edit Produk</h1>
      
      <ProductForm categories={categories} product={product} action={updateProductWithId} />
    </div>
  )
}
