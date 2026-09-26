"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MailOpen, Mail, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { deleteContactMessage, setContactMessageRead } from "@/lib/actions/contact";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/Providers";

interface MessageActionsProps {
  id: string;
  isRead: boolean;
}

export default function MessageActions({ id, isRead }: MessageActionsProps) {
  const router = useRouter();
  const addToast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const run = async (action: () => Promise<{ success?: boolean; error?: string }>, okMessage: string) => {
    setIsPending(true);
    try {
      const res = await action();
      if (res?.error) {
        addToast(res.error, { type: "error" });
        return;
      }
      addToast(okMessage, { type: "success" });
      router.refresh();
    } catch (error: any) {
      addToast(error?.message || "Terjadi kesalahan.", { type: "error" });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() =>
            run(
              () => setContactMessageRead(id, !isRead),
              isRead ? "Pesan ditandai belum dibaca." : "Pesan ditandai sudah dibaca."
            )
          }
          disabled={isPending}
          title={isRead ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
          className="p-2 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-brand-forest-700 dark:hover:text-brand-forest-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isRead ? (
            <Mail className="w-4 h-4" />
          ) : (
            <MailOpen className="w-4 h-4" />
          )}
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={isPending}
          title="Hapus Pesan"
          className="p-2 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => !isPending && setIsModalOpen(false)}
        className="max-w-sm p-0 overflow-hidden"
      >
        <div className="p-6 text-center font-sans">
          <div className="w-12 h-12 rounded-full bg-danger-bg flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-danger" />
          </div>
          <h3 className="font-heading text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Hapus Pesan?
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
            Pesan ini akan dihapus permanen dari database dan tidak bisa dikembalikan.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setIsModalOpen(false)}
              disabled={isPending}
              className="flex-1 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={() =>
                run(() => deleteContactMessage(id), "Pesan berhasil dihapus.")
              }
              disabled={isPending}
              className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium inline-flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ya, Hapus"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
