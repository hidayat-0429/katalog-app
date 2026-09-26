"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";

export default function Loading() {
  const t = useTranslations();
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
      <Loader2 className="w-8 h-8 animate-spin text-brand-forest-600 dark:text-brand-forest-400 mb-4" />
      <h2 className="font-heading text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        {t.common.loadingTitle}
      </h2>
      <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400 mt-1">
        {t.common.loadingHint}
      </p>
    </div>
  );
}
