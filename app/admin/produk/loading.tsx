import { SkeletonPageTitle, SkeletonRows } from "@/components/Skeleton";

export default function AdminProdukLoading() {
  return (
    <div className="space-y-5">
      <span role="status" className="sr-only">
        Memuat data…
      </span>
      <SkeletonPageTitle />
      <SkeletonRows count={8} />
    </div>
  );
}
