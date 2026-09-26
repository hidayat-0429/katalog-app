"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { XCircle, Loader2 } from "lucide-react";
import { cancelOrder } from "@/lib/actions/orders";
import { useTranslations } from "@/hooks/useTranslations";

export default function CancelOrderButton({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const t = useTranslations();

  const handleCancel = () => {
    if (confirm(t.invoice.cancelConfirm)) {
      startTransition(async () => {
        try {
          await cancelOrder(orderId);
          router.refresh();
        } catch (error) {
          console.error("Gagal membatalkan pesanan", error);
          alert(t.invoice.cancelFailed);
        }
      });
    }
  };

  return (
    <button
      onClick={handleCancel}
      disabled={isPending}
      className="btn-danger border border-clay/20 bg-clay/5 px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isPending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{t.invoice.canceling}</span>
        </>
      ) : (
        <>
          <XCircle className="w-4 h-4" />
          <span>{t.invoice.cancelButton}</span>
        </>
      )}
    </button>
  );
}
