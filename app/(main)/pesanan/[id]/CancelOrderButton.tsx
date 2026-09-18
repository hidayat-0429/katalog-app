"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { XCircle, Loader2 } from "lucide-react";
import { cancelOrder } from "@/lib/actions/orders";

export default function CancelOrderButton({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCancel = () => {
    if (confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) {
      startTransition(async () => {
        try {
          await cancelOrder(orderId);
          router.refresh();
        } catch (error) {
          console.error("Gagal membatalkan pesanan", error);
          alert("Gagal membatalkan pesanan. Silakan coba lagi.");
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
          <span>Membatalkan...</span>
        </>
      ) : (
        <>
          <XCircle className="w-4 h-4" />
          <span>Batalkan Pesanan</span>
        </>
      )}
    </button>
  );
}
