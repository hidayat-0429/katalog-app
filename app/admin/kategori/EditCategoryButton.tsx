'use client';

import { useState } from 'react';
import { Pencil, X, Save, Loader2, AlertCircle } from 'lucide-react';
import { updateCategory } from '@/lib/actions/categories';

interface EditCategoryButtonProps {
  id: string;
  currentName: string;
  currentNameEn?: string | null;
  currentDescription?: string | null;
}

export default function EditCategoryButton({ id, currentName, currentNameEn, currentDescription }: EditCategoryButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState(currentName);
  const [nameEn, setNameEn] = useState(currentNameEn || '');
  const [description, setDescription] = useState(currentDescription || '');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    try {
      const res = await updateCategory(id, formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setIsOpen(false);
      }
    } catch (err: any) {
      setError(err?.message || 'Gagal memperbarui kategori');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 w-9 h-9 rounded-md flex items-center justify-center transition-colors duration-150 ease-out"
        title="Edit Kategori"
      >
        <Pencil className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !isPending && setIsOpen(false)}
          />
          {/* Modal */}
          <div className="relative w-full max-w-md bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-200 dark:border-neutral-700">
              <h2 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">Edit Kategori</h2>
              <button
                onClick={() => !isPending && setIsOpen(false)}
                className="btn-icon"
                disabled={isPending}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="text-xs text-semantic-danger-DEFAULT dark:text-semantic-danger-DEFAULT bg-semantic-danger-light dark:bg-semantic-danger-darkBg p-2.5 rounded border border-semantic-danger-DEFAULT dark:border-semantic-danger-dark flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label htmlFor="edit-name" className="font-medium text-neutral-900 dark:text-neutral-100">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isPending}
                  className="input w-full text-xs disabled:opacity-50"
                  placeholder="Contoh: Jamur Segar / Pouch"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="edit-nameEn" className="font-medium text-neutral-900 dark:text-neutral-100">
                  Nama Kategori (Bahasa Inggris) - opsional
                </label>
                <input
                  type="text"
                  id="edit-nameEn"
                  name="nameEn"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  disabled={isPending}
                  className="input w-full text-xs disabled:opacity-50"
                  placeholder="Contoh: Fresh Mushrooms"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="edit-description" className="font-medium text-neutral-900 dark:text-neutral-100">
                  Keterangan (Opsional)
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isPending}
                  className="input w-full min-h-[70px] text-xs disabled:opacity-50"
                  placeholder="Deskripsi singkat jenis produk..."
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                  className="btn-secondary text-xs py-1.5 px-3"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-primary text-xs py-1.5 px-3"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Simpan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
