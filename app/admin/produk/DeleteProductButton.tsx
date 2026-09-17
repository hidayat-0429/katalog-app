"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { deleteProduct } from "@/lib/actions/products";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui";
import { useToast } from "@/components/Providers";

interface DeleteProductButtonProps {
  id: string;
  name?: string; // name dilempar untuk memperjelas konfirmasi
}

export default function DeleteProductButton({ id, name }: DeleteProductButtonProps) {
  const router = useRouter();
  const addToast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    setIsPending(true);
    try {
      await deleteProduct(id);
      addToast("Produk berhasil dihapus dari katalog.", { type: "success" });
      setIsModalOpen(false);
      router.refresh();
    } catch (error: any) {
      console.error(error);
      addToast(error?.message || "Terjadi kesalahan menghapus produk.", { type: "error" });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={isPending}
        className="btn-danger inline-flex items-center justify-center p-2 rounded-lg gap-2 text-sm disabled:opacity-50"
        title="Hapus Produk"
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => !isPending && setIsModalOpen(false)}
        className="max-w-sm p-0 overflow-hidden"
      >
        <div className="p-6 text-center font-sans">
          <div className="w-12 h-12 rounded-full bg-danger-bg flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-danger" />
          </div>
          <h3 className="font-heading text-lg font-semibold text-charcoal mb-2">
            Hapus Produk?
          </h3>
          <p className="text-sm text-charcoal-muted leading-relaxed mb-6">
            Apakah Anda yakin ingin menghapus produk <br />
            {name ? <strong className="text-charcoal block mt-1">{name}</strong> : "ini"}{" "}
            dari katalog?
            <br />
            <br />
            <span className="text-xs">
              Pesanan yang sudah menggunakan produk ini tetap akan dipertahankan dalam data historis.
            </span>
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button
              variant="primary"
              className="flex-1 bg-danger hover:bg-red-700 border-danger focus:ring-red-500/30"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ya, Hapus"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
