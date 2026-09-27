import Container from "@/components/Container";
import { Skeleton, SkeletonCard } from "@/components/Skeleton";
import SkeletonStatus from "@/components/SkeletonStatus";

export default function Loading() {
  return (
    <Container className="py-8 sm:py-10">
      <SkeletonStatus />
      <div className="flex items-center justify-between gap-4 mb-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>
      <SkeletonCard className="p-6 sm:p-8 space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-2 sm:text-right">
            <Skeleton className="h-3 w-32 sm:ml-auto" />
            <Skeleton className="h-4 w-40 sm:ml-auto" />
          </div>
        </div>
        <Skeleton className="h-px w-full" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <Skeleton className="h-4 flex-1 max-w-xs" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
        <Skeleton className="h-px w-full" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-6 w-32" />
        </div>
      </SkeletonCard>
    </Container>
  );
}
