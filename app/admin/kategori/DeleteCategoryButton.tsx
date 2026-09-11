'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteCategory } from '@/lib/actions/categories'

export default function DeleteCategoryButton({ id, disabled }: { id: string, disabled: boolean }) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const handleDelete = async () => {
    if (disabled) return;
    if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      setIsPending(true)
      try {
        await deleteCategory(id)
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
      disabled={isPending || disabled}
      className={`btn-icon ${disabled ? 'text-stone-300 cursor-not-allowed' : 'text-stone-400 hover:text-clay hover:bg-clay/10'}`}
      title={disabled ? 'Tidak dapat menghapus kategori yang memiliki produk' : 'Hapus Kategori'}
    >
      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  )
}
