'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Save, Tag, Upload, Link as LinkIcon, X, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react'

type ProductFormProps = {
  categories: { id: string, name: string }[]
  product?: any
  action: (formData: FormData) => Promise<any>
}

export default function ProductForm({ categories, product, action }: ProductFormProps) {
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || '')
  const [uploadMode, setUploadMode] = useState<'upload' | 'url'>('upload')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [formError, setFormError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    if (!file) return
    setIsUploading(true)
    setUploadError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        setUploadError(data.error || 'Gagal mengunggah gambar')
      } else {
        setImageUrl(data.url)
      }
    } catch (err: any) {
      setUploadError(err.message || 'Terjadi kesalahan saat upload')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError('')
    setIsSaving(true)

    const formData = new FormData(e.currentTarget)
    try {
      const res = await action(formData)
      if (res?.error) {
        setFormError(res.error)
        setIsSaving(false)
      }
    } catch (err: any) {
      if (err?.message?.includes('NEXT_REDIRECT')) {
        throw err
      }
      setFormError(err?.message || 'Gagal menyimpan data produk')
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-charcoal dark:text-dark-text">
      {formError && (
        <div className="text-xs text-[#B91C1C] dark:text-[#F87171] bg-red-50 dark:bg-red-950/20 p-3 rounded border border-red-200 dark:border-red-900/30 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Hidden input to pass imageUrl to server action */}
      <input type="hidden" name="imageUrl" value={imageUrl} />

      {/* Info Produk */}
      <div className="card p-5 space-y-4">
        <h3 className="font-bold text-sm text-charcoal dark:text-dark-text border-b border-border dark:border-dark-border pb-2">
          Informasi Produk
        </h3>
        
        <div className="space-y-1">
          <label htmlFor="name" className="text-xs font-medium text-charcoal dark:text-dark-text flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" /> Nama Produk
          </label>
          <input type="text" id="name" name="name" defaultValue={product?.name} required className="input w-full" placeholder="Contoh: Jamur Kancing Kaleng 425g" />
        </div>

        <div className="space-y-1">
          <label htmlFor="categoryId" className="text-xs font-medium text-charcoal dark:text-dark-text">Kategori</label>
          <select id="categoryId" name="categoryId" defaultValue={product?.categoryId || ''} required className="input w-full">
            <option value="" disabled>Pilih Kategori</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="description" className="text-xs font-medium text-charcoal dark:text-dark-text">Deskripsi</label>
          <textarea id="description" name="description" defaultValue={product?.description || ''} className="input w-full min-h-[90px]" placeholder="Spesifikasi, mutu, dan keterangan isi kemasan..." />
        </div>
      </div>

      {/* Harga & Stok */}
      <div className="card p-5 space-y-4">
        <h3 className="font-bold text-sm text-charcoal dark:text-dark-text border-b border-border dark:border-dark-border pb-2">
          Harga &amp; Persediaan
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="price" className="text-xs font-medium text-charcoal dark:text-dark-text">Harga Satuan (Rp)</label>
            <input type="number" id="price" name="price" defaultValue={product?.price} required min="0" className="input w-full" placeholder="0" />
          </div>
          
          <div className="space-y-1">
            <label htmlFor="unit" className="text-xs font-medium text-charcoal dark:text-dark-text">Satuan Kemasan</label>
            <input type="text" id="unit" name="unit" defaultValue={product?.unit || 'kaleng'} required className="input w-full" placeholder="kaleng, pouch, kg, pack, karton..." />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="stock" className="text-xs font-medium text-charcoal dark:text-dark-text">Jumlah Stok Gudang</label>
          <input type="number" id="stock" name="stock" defaultValue={product?.stock ?? 0} required min="0" className="input w-full md:w-1/2" placeholder="0" />
        </div>
      </div>

      {/* Media & Gambar Produk */}
      <div className="card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border dark:border-dark-border pb-2">
          <h3 className="font-bold text-sm text-charcoal dark:text-dark-text">Foto Produk</h3>
          <div className="flex items-center gap-1 bg-bg-subtle dark:bg-dark-bg-subtle p-1 rounded text-xs font-medium border border-border dark:border-dark-border">
            <button
              type="button"
              onClick={() => setUploadMode('upload')}
              className={`px-2 py-0.5 rounded transition-all flex items-center gap-1 text-xs ${
                uploadMode === 'upload' ? 'bg-white dark:bg-dark-surface font-semibold text-charcoal dark:text-dark-text border border-border dark:border-dark-border' : 'text-charcoal-muted dark:text-dark-muted'
              }`}
            >
              <Upload className="w-3 h-3" /> Unggah Berkas
            </button>
            <button
              type="button"
              onClick={() => setUploadMode('url')}
              className={`px-2 py-0.5 rounded transition-all flex items-center gap-1 text-xs ${
                uploadMode === 'url' ? 'bg-white dark:bg-dark-surface font-semibold text-charcoal dark:text-dark-text border border-border dark:border-dark-border' : 'text-charcoal-muted dark:text-dark-muted'
              }`}
            >
              <LinkIcon className="w-3 h-3" /> Tautan URL
            </button>
          </div>
        </div>

        {uploadError && (
          <div className="text-xs text-[#B91C1C] dark:text-[#F87171] bg-red-50 dark:bg-red-950/20 p-2.5 rounded border border-red-200 dark:border-red-900/30">
            {uploadError}
          </div>
        )}

        {/* Upload Mode UI */}
        {uploadMode === 'upload' ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border border-dashed border-border dark:border-dark-border hover:border-charcoal dark:hover:border-dark-text rounded-lg p-6 text-center transition-colors bg-bg-subtle dark:bg-dark-bg-subtle flex flex-col items-center justify-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0])
                }
              }}
            />
            {isUploading ? (
              <div className="flex flex-col items-center gap-2 py-3">
                <Loader2 className="w-6 h-6 animate-spin text-charcoal dark:text-dark-text" />
                <p className="text-xs font-medium">Sedang mengunggah foto...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-9 h-9 rounded bg-white dark:bg-dark-surface border border-border dark:border-dark-border flex items-center justify-center text-charcoal-muted dark:text-dark-muted">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-charcoal dark:text-dark-text">
                    Klik untuk pilih berkas foto atau tarik ke sini
                  </p>
                  <p className="text-[11px] text-charcoal-muted dark:text-dark-muted mt-0.5">
                    Mendukung JPG, PNG, WEBP (Maksimal 5MB)
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            <label htmlFor="urlInput" className="text-xs font-medium text-charcoal dark:text-dark-text">URL Gambar Eksternal</label>
            <input 
              type="url" 
              id="urlInput" 
              value={imageUrl} 
              onChange={(e) => setImageUrl(e.target.value)} 
              className="input w-full" 
              placeholder="https://example.com/foto-produk.jpg" 
            />
          </div>
        )}

        {/* Live Preview & Remove */}
        {imageUrl && (
          <div className="flex items-center gap-3 p-2.5 bg-bg-subtle dark:bg-dark-surface border border-border dark:border-dark-border rounded">
            <div className="relative w-14 h-14 rounded overflow-hidden bg-white dark:bg-dark-bg border border-border dark:border-dark-border shrink-0">
              <Image 
                src={imageUrl} 
                alt="Preview Produk" 
                fill 
                className="object-cover" 
                unoptimized={imageUrl.startsWith('http')} 
              />
            </div>
            <div className="flex-1 min-w-0 text-xs">
              <p className="font-semibold text-sage dark:text-dark-sage flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5" /> Foto terpasang
              </p>
              <p className="text-[11px] text-charcoal-muted dark:text-dark-muted truncate mt-0.5">{imageUrl}</p>
            </div>
            <button
              type="button"
              onClick={() => setImageUrl('')}
              className="p-1 text-charcoal-muted dark:text-dark-muted hover:text-[#B91C1C] rounded transition-colors"
              title="Hapus Gambar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="card p-5 space-y-3">
        <h3 className="font-bold text-sm text-charcoal dark:text-dark-text border-b border-border dark:border-dark-border pb-2">
          Visibilitas &amp; Status
        </h3>
        
        <div className="flex flex-wrap gap-6 text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isActive" defaultChecked={product?.isActive ?? true} className="w-4 h-4 rounded border-border focus:ring-charcoal" />
            <span className="font-medium text-charcoal dark:text-dark-text">Aktif (Dapat Dipesan di Katalog)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured ?? false} className="w-4 h-4 rounded border-border focus:ring-charcoal" />
            <span className="font-medium text-charcoal dark:text-dark-text">Tandai Sebagai Produk Pilihan (Featured)</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={isSaving} className="btn-primary">
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Simpan Data Produk</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}
