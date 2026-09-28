import { Skeleton, SkeletonCard, SkeletonPageTitle } from "@/components/Skeleton";
import SkeletonStatus from "@/components/SkeletonStatus";
import Container from "@/components/Container";

export default function Loading() {
  return (
    <Container className="py-8 max-w-3xl">
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
    </Container>
  );
}
