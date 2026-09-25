'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Save, Tag, Upload, Link as LinkIcon, X, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui'

interface ProductData {
  id?: string;
  name: string;
  categoryId: string;
  description?: string | null;
  price: number;
  unit: string;
  stock: number;
  imageUrl?: string | null;
  isActive: boolean;
  isFeatured: boolean;
}

type ProductFormProps = {
  categories: { id: string, name: string }[]
  product?: ProductData | null
  action: (formData: FormData) => Promise<{ error?: string } | void>
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {formError && (
        <div className="text-sm text-semantic-danger-dark bg-semantic-danger-light p-3 rounded-md border border-semantic-danger-DEFAULT flex items-center gap-2 dark:bg-semantic-danger-darkBg dark:text-red-200 dark:border-red-900">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Hidden input to pass imageUrl to server action */}
      <input type="hidden" name="imageUrl" value={imageUrl} />

      {/* Info Produk */}
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6">
        <h3 className="font-display text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6 pb-3 border-b border-neutral-200 dark:border-neutral-700">
          Informasi Produk
        </h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-xs uppercase tracking-wide font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Nama Produk
              </label>
              <input type="text" id="name" name="name" defaultValue={product?.name} required className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-base focus:outline-none focus:ring-2 focus:ring-brand-forest-500 focus:border-brand-forest-500 transition-colors duration-150 ease-out placeholder:text-neutral-400 dark:placeholder:text-neutral-500 disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed dark:disabled:bg-neutral-900" placeholder="Contoh: Jamur Kancing Kaleng 425g" />
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-xs uppercase tracking-wide font-medium text-neutral-700 dark:text-neutral-300 mb-2">Kategori</label>
              <select id="categoryId" name="categoryId" defaultValue={product?.categoryId || ''} required className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-base focus:outline-none focus:ring-2 focus:ring-brand-forest-500 focus:border-brand-forest-500 transition-colors duration-150 ease-out disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed dark:disabled:bg-neutral-900">
                <option value="" disabled>Pilih Kategori</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-xs uppercase tracking-wide font-medium text-neutral-700 dark:text-neutral-300 mb-2">Deskripsi</label>
            <textarea id="description" name="description" defaultValue={product?.description || ''} rows={4} className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-base focus:outline-none focus:ring-2 focus:ring-brand-forest-500 focus:border-brand-forest-500 transition-colors duration-150 ease-out placeholder:text-neutral-400 dark:placeholder:text-neutral-500 resize-none" placeholder="Spesifikasi, mutu, dan keterangan isi kemasan..." />
          </div>
        </div>
      </div>

      {/* Harga & Stok */}
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6">
        <h3 className="font-display text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6 pb-3 border-b border-neutral-200 dark:border-neutral-700">
          Harga &amp; Persediaan
        </h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="price" className="block text-xs uppercase tracking-wide font-medium text-neutral-700 dark:text-neutral-300 mb-2">Harga Satuan (Rp)</label>
              <input type="number" id="price" name="price" defaultValue={product?.price} required min="0" className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-base font-mono focus:outline-none focus:ring-2 focus:ring-brand-forest-500 focus:border-brand-forest-500 transition-colors duration-150 ease-out placeholder:text-neutral-400 dark:placeholder:text-neutral-500" placeholder="0" />
            </div>
            
            <div>
              <label htmlFor="unit" className="block text-xs uppercase tracking-wide font-medium text-neutral-700 dark:text-neutral-300 mb-2">Satuan Kemasan</label>
              <input type="text" id="unit" name="unit" defaultValue={product?.unit || 'kaleng'} required className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-base focus:outline-none focus:ring-2 focus:ring-brand-forest-500 focus:border-brand-forest-500 transition-colors duration-150 ease-out placeholder:text-neutral-400 dark:placeholder:text-neutral-500" placeholder="kaleng, pouch, kg..." />
            </div>

            <div>
              <label htmlFor="stock" className="block text-xs uppercase tracking-wide font-medium text-neutral-700 dark:text-neutral-300 mb-2">Stok Gudang</label>
              <input type="number" id="stock" name="stock" defaultValue={product?.stock ?? 0} required min="0" className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-base font-mono focus:outline-none focus:ring-2 focus:ring-brand-forest-500 focus:border-brand-forest-500 transition-colors duration-150 ease-out placeholder:text-neutral-400 dark:placeholder:text-neutral-500" placeholder="0" />
            </div>
          </div>
        </div>
      </div>

      {/* Media & Gambar Produk */}
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-neutral-200 dark:border-neutral-700">
          <h3 className="font-display text-lg font-semibold text-neutral-900 dark:text-neutral-100">Foto Produk</h3>
          <div className="inline-flex items-center gap-1 bg-neutral-100 dark:bg-neutral-700 p-1 rounded-md border border-neutral-200 dark:border-neutral-600">
            <button
              type="button"
              onClick={() => setUploadMode('upload')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors duration-150 flex items-center gap-1.5 ${
                uploadMode === 'upload' ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm border border-neutral-300 dark:border-neutral-600' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <Upload className="w-3.5 h-3.5" /> Unggah Berkas
            </button>
            <button
              type="button"
              onClick={() => setUploadMode('url')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors duration-150 flex items-center gap-1.5 ${
                uploadMode === 'url' ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm border border-neutral-300 dark:border-neutral-600' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" /> Tautan URL
            </button>
          </div>
        </div>

        {uploadError && (
          <div className="mb-4 text-sm text-semantic-danger-dark bg-semantic-danger-light p-3 rounded-md border border-semantic-danger-DEFAULT dark:bg-semantic-danger-darkBg dark:text-red-200 dark:border-red-900">
            {uploadError}
          </div>
        )}

        {/* Upload Mode UI */}
        {uploadMode === 'upload' ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500 rounded-lg p-8 text-center transition-colors duration-150 bg-neutral-50 dark:bg-neutral-900 flex flex-col items-center justify-center cursor-pointer"
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
              <div className="flex flex-col items-center gap-3 py-4">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-600 dark:text-neutral-400" />
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Sedang mengunggah foto...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    Klik untuk pilih berkas foto atau tarik ke sini
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Mendukung JPG, PNG, WEBP (Maksimal 5MB)
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <label htmlFor="urlInput" className="block text-xs uppercase tracking-wide font-medium text-neutral-700 dark:text-neutral-300 mb-2">URL Gambar Eksternal</label>
            <input 
              type="url" 
              id="urlInput" 
              value={imageUrl} 
              onChange={(e) => setImageUrl(e.target.value)} 
              className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-base focus:outline-none focus:ring-2 focus:ring-brand-forest-500 focus:border-brand-forest-500 transition-colors duration-150 ease-out placeholder:text-neutral-400 dark:placeholder:text-neutral-500" 
              placeholder="https://example.com/foto-produk.jpg" 
            />
          </div>
        )}

        {/* Live Preview & Remove */}
        {imageUrl && (
          <div className="flex items-center gap-4 p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md mt-4">
            <div className="relative w-16 h-16 rounded-md overflow-hidden bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shrink-0">
              <Image 
                src={imageUrl} 
                alt="Preview Produk" 
                fill 
                className="object-cover" 
                unoptimized={imageUrl.startsWith('http')} 
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-brand-forest-600 dark:text-brand-forest-400" /> Foto terpasang
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-1">{imageUrl}</p>
            </div>
            <button
              type="button"
              onClick={() => setImageUrl('')}
              className="p-2 text-neutral-500 dark:text-neutral-400 hover:text-semantic-danger-DEFAULT hover:bg-semantic-danger-light dark:hover:bg-semantic-danger-darkBg rounded-md transition-colors duration-150"
              title="Hapus Gambar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6">
        <h3 className="font-display text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6 pb-3 border-b border-neutral-200 dark:border-neutral-700">
          Visibilitas &amp; Status
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-4 text-sm">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" name="isActive" defaultChecked={product?.isActive ?? true} className="w-4 h-4 rounded border-neutral-300 focus:ring-brand-forest-500" />
            <span className="font-medium text-neutral-700 dark:text-neutral-300">Aktif (Dapat Dipesan di Katalog)</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured ?? false} className="w-4 h-4 rounded border-neutral-300 focus:ring-brand-forest-500" />
            <span className="font-medium text-neutral-700 dark:text-neutral-300">Tandai Sebagai Produk Pilihan (Featured)</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-neutral-200 dark:border-neutral-700">
        <Button type="submit" variant="primary" disabled={isSaving}>
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
        </Button>
      </div>
    </form>
  )
}
