"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
}

export default function PaginationControls({ currentPage, totalPages }: PaginationControlsProps) {
  const searchParams = useSearchParams();
  const baseParams = new URLSearchParams(searchParams?.toString() ?? "");
  baseParams.delete("page");

  const buildHref = (page: number) => {
    const sp = new URLSearchParams(baseParams);
    sp.set("page", page.toString());
    return `?${sp.toString()}`;
  };

  if (totalPages <= 1) return null;

  // Bangun range halaman dengan ellipsis
  const getPageRange = (): (number | "...")[] => {
    const delta = 2;
    const range: (number | "...")[] = [];
    const left = Math.max(1, currentPage - delta);
    const right = Math.min(totalPages, currentPage + delta);

    if (left > 1) {
      range.push(1);
      if (left > 2) range.push("...");
    }
    for (let i = left; i <= right; i++) range.push(i);
    if (right < totalPages) {
      if (right < totalPages - 1) range.push("...");
      range.push(totalPages);
    }
    return range;
  };

  const btnBase = "inline-flex items-center justify-center h-11 min-w-[44px] px-3 rounded-md text-sm font-medium transition-colors duration-150 ease-out";
  const btnActive = `${btnBase} bg-brand-forest-600 dark:bg-brand-forest-700 text-white font-semibold`;
  const btnNormal = `${btnBase} bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:bg-neutral-800/50`;
  const btnDisabled = `${btnBase} bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 opacity-40 cursor-not-allowed pointer-events-none`;
  const btnNav = `${btnBase} bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:bg-neutral-800/50 gap-2 px-4`;

  return (
    <nav aria-label="Navigasi halaman" className="flex items-center gap-1.5 flex-wrap justify-center">
      {currentPage > 1 ? (
        <Link href={buildHref(currentPage - 1)} className={btnNav}>
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Sebelumnya</span>
        </Link>
      ) : (
        <span className={btnDisabled}>
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Sebelumnya</span>
        </span>
      )}

      {getPageRange().map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-neutral-500 dark:text-neutral-400 text-sm select-none">…</span>
        ) : (
          <Link
            key={page}
            href={buildHref(page as number)}
            className={page === currentPage ? btnActive : btnNormal}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link href={buildHref(currentPage + 1)} className={btnNav}>
          <span className="hidden sm:inline">Berikutnya</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span className={btnDisabled}>
          <span className="hidden sm:inline">Berikutnya</span>
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </nav>
  );
}
