"use client";

import { useTranslations } from "@/hooks/useTranslations";

// Kerangka bentuknya murni visual, jadi ditandai aria-hidden; label ini yang
// memberi tahu pembaca layar bahwa halaman masih memuat.
export default function SkeletonStatus() {
  const t = useTranslations();
  return <span role="status" className="sr-only">{t.common.loadingTitle}</span>;
}
