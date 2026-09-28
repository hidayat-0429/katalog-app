import Container from "@/components/Container";
import { SkeletonPageTitle, SkeletonRows } from "@/components/Skeleton";
import SkeletonStatus from "@/components/SkeletonStatus";

export default function Loading() {
  return (
    <Container className="py-8 max-w-4xl">
      <SkeletonStatus />
      <SkeletonPageTitle />
      <SkeletonRows count={4} />
    </Container>
  );
}
