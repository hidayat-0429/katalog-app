import { SkeletonPageTitle, SkeletonRows } from "@/components/Skeleton";

export default function AdminPesananLoading() {
  return (
    <div className="space-y-5">
      <span role="status" className="sr-only">
        Memuat data…
      </span>
      <SkeletonPageTitle />
      <SkeletonRows count={6} />
    </div>
  );
}
