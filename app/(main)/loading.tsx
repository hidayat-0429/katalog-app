import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
      <Loader2 className="w-8 h-8 animate-spin text-brand-forest-600 dark:text-brand-forest-400 mb-4" />
      <h2 className="font-heading text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        Memuat Data...
      </h2>
      <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400 mt-1">
        Mohon tunggu sebentar.
      </p>
    </div>
  );
}
