"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
}

export default function PaginationControls({ currentPage, totalPages }: PaginationControlsProps) {
  const searchParams = useSearchParams();
  const baseParams = new URLSearchParams(searchParams.toString());
  baseParams.delete("page");

  const buildHref = (page: number) => {
    const sp = new URLSearchParams(baseParams);
    sp.set("page", page.toString());
    return `?${sp.toString()}`;
  };

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex justify-center gap-2 mt-6">
      {pages.map((page) => (
        <Link
          key={page}
          href={buildHref(page)}
          className={`px-3 py-1 text-sm rounded ${page === currentPage ? "bg-sage text-white" : "bg-bg-subtle text-charcoal hover:bg-bg-subtle/80"}`}
        >
          {page}
        </Link>
      ))}
    </nav>
  );
}
