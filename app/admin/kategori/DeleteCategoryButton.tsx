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
        const res = await deleteCategory(id)
        if (res?.error) {
          alert(res.error)
        } else {
          router.refresh()
        }
      } catch (error: any) {
        console.error(error)
        alert(error?.message || 'Gagal menghapus kategori. Silakan coba lagi.')
      } finally {
        setIsPending(false)
      }
    }
  }

  return (
    <button 
      onClick={handleDelete} 
      disabled={isPending || disabled}
      className={`btn-icon ${disabled ? 'text-neutral-300 cursor-not-allowed' : 'text-neutral-400 hover:text-clay hover:bg-clay/10'}`}
      title={disabled ? 'Tidak dapat menghapus kategori yang memiliki produk' : 'Hapus Kategori'}
    >
      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  )
}
