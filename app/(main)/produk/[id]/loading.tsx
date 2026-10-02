import { Skeleton, SkeletonText } from "@/components/Skeleton";
import SkeletonStatus from "@/components/SkeletonStatus";

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-6 px-4 sm:px-6">
      <SkeletonStatus />
      <Skeleton className="h-4 w-28 mb-6" />
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-5 w-28 rounded-full" />
          <Skeleton className="h-9 w-2/3" />
          <Skeleton className="h-6 w-36" />
          <SkeletonText lines={5} />
          <Skeleton className="h-11 w-40 rounded-lg" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
