'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteProduct } from '@/lib/actions/products'

export default function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const handleDelete = async () => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      setIsPending(true)
      try {
        await deleteProduct(id)
        router.refresh()
      } catch (error) {
        console.error(error)
      } finally {
        setIsPending(false)
      }
    }
  }

  return (
    <button 
      onClick={handleDelete} 
      disabled={isPending}
      className="btn-danger inline-flex items-center justify-center p-2 rounded-lg gap-2 text-sm disabled:opacity-50"
      title="Hapus Produk"
    >
      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  )
}
