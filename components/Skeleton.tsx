import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Semua bentuk kerangka pakai kelas `.skeleton` dari globals.css supaya
// animasinya ikut mati saat pengguna memilih prefers-reduced-motion.

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("skeleton rounded", className)} />;
}

const LINE_WIDTHS = ["w-full", "w-11/12", "w-4/5", "w-2/3", "w-1/2", "w-1/3"];

export function SkeletonText({
  lines = 3,
  className,
  lineClassName,
}: {
  lines?: number;
  className?: string;
  lineClassName?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-4", LINE_WIDTHS[i % LINE_WIDTHS.length], lineClassName)}
        />
      ))}
    </div>
  );
}

// Sama seperti kartu daftar yang dipakai halaman admin dan pesanan.
export function SkeletonCard({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-neutral-200 dark:border-neutral-700 bg-surface p-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SkeletonPageTitle({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-2 mb-8", className)}>
      <Skeleton className="h-8 w-56 max-w-full rounded" />
      <Skeleton className="h-4 w-80 max-w-full rounded" />
    </div>
  );
}

export function SkeletonRows({ count = 5, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} className="flex flex-col sm:flex-row justify-between gap-3">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48 max-w-full" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        </SkeletonCard>
      ))}
    </div>
  );
}

export function SkeletonTiles({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} className="p-6 space-y-3">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-16" />
        </SkeletonCard>
      ))}
    </div>
  );
}

export function SkeletonPanel({ className, lines = 4 }: { className?: string; lines?: number }) {
  return (
    <SkeletonCard className={cn("p-6 space-y-4", className)}>
      <Skeleton className="h-4 w-40" />
      <SkeletonText lines={lines} />
    </SkeletonCard>
  );
}
