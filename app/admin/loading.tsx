import { Skeleton, SkeletonPageTitle, SkeletonPanel, SkeletonTiles } from "@/components/Skeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <span role="status" className="sr-only">
        Memuat data…
      </span>
      <SkeletonPageTitle />
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-surface p-6 space-y-3">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-3 w-56" />
      </div>
      <SkeletonTiles />
      <div className="grid md:grid-cols-2 gap-6">
        <SkeletonPanel lines={5} />
        <SkeletonPanel lines={5} />
      </div>
    </div>
  );
}
