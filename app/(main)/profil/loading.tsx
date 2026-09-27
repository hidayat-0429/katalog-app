import { Skeleton, SkeletonCard, SkeletonPageTitle } from "@/components/Skeleton";
import SkeletonStatus from "@/components/SkeletonStatus";

export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-10 px-4 sm:px-6">
      <SkeletonStatus />
      <SkeletonPageTitle />
      <SkeletonCard className="p-6 space-y-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-full rounded" />
          </div>
        ))}
        <Skeleton className="h-11 w-36 rounded-lg" />
      </SkeletonCard>
    </div>
  );
}
