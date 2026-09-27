import { Skeleton, SkeletonCard, SkeletonText } from "@/components/Skeleton";

export default function AdminProdukBaruLoading() {
  return (
    <div className="space-y-6">
      <span role="status" className="sr-only">
        Memuat data…
      </span>
      <Skeleton className="h-4 w-40 rounded" />
      <Skeleton className="h-8 w-44 rounded" />
      <SkeletonCard className="p-6 space-y-6">
        <SkeletonText lines={2} />
        <div className="grid sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </SkeletonCard>
    </div>
  );
}
