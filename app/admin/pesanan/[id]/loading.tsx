import { Skeleton, SkeletonCard, SkeletonText } from "@/components/Skeleton";

export default function AdminPesananDetailLoading() {
  return (
    <div className="space-y-6">
      <span role="status" className="sr-only">
        Memuat data…
      </span>

      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-5 border-b border-neutral-200 dark:border-neutral-700">
        <div className="space-y-2">
          <Skeleton className="h-7 w-52 max-w-full rounded" />
          <Skeleton className="h-3 w-64 max-w-full rounded" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <SkeletonCard className="p-5 space-y-3">
          <Skeleton className="h-3 w-36" />
          <SkeletonText lines={4} />
        </SkeletonCard>
        <SkeletonCard className="p-5 space-y-3">
          <Skeleton className="h-3 w-36" />
          <SkeletonText lines={4} />
        </SkeletonCard>
      </div>

      <SkeletonCard className="p-5 space-y-4">
        <Skeleton className="h-3 w-32" />
        <SkeletonText lines={5} />
      </SkeletonCard>
    </div>
  );
}
