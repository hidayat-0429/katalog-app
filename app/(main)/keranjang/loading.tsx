import { Skeleton, SkeletonCard, SkeletonPageTitle } from "@/components/Skeleton";
import SkeletonStatus from "@/components/SkeletonStatus";

export default function Loading() {
  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto">
      <SkeletonStatus />
      <SkeletonPageTitle />
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} className="flex gap-4">
              <Skeleton className="w-20 h-20 rounded shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-28 rounded" />
              </div>
            </SkeletonCard>
          ))}
        </div>
        <div className="lg:col-span-5">
          <SkeletonCard className="p-6 space-y-4">
            <Skeleton className="h-5 w-32" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
            <Skeleton className="h-11 w-full rounded-lg" />
          </SkeletonCard>
        </div>
      </div>
    </div>
  );
}
