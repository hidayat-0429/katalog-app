import Container from "@/components/Container";
import { ProductSkeletonGrid } from "@/components/ProductSkeleton";
import { SkeletonPageTitle } from "@/components/Skeleton";
import SkeletonStatus from "@/components/SkeletonStatus";

export default function Loading() {
  return (
    <section className="py-10 sm:py-14">
      <Container>
        <SkeletonStatus />
        <SkeletonPageTitle />
        <ProductSkeletonGrid count={8} />
      </Container>
    </section>
  );
}
