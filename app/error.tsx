"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if available
    console.error("Global Application Error Captured:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 bg-danger-bg border border-danger/20 rounded-full flex items-center justify-center text-danger mb-6">
        <AlertTriangle className="w-8 h-8" />
      </div>
      
      <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-charcoal mb-4">
        Terjadi Kesalahan Sistem
      </h1>
      
      <p className="font-sans text-sm sm:text-base text-charcoal-muted max-w-md mx-auto mb-8 leading-relaxed">
        Maaf, kami mengalami gangguan teknis saat memproses permintaan Anda. Hal ini bisa disebabkan oleh koneksi yang tidak stabil atau pembaruan sistem yang sedang berlangsung.
      </p>
      
      <div className="flex gap-4">
        <Button variant="primary" onClick={() => reset()} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          <span>Coba Muat Ulang</span>
        </Button>
      </div>
    </div>
  );
}
