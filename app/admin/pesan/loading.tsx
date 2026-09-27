import { Skeleton, SkeletonPageTitle, SkeletonRows } from "@/components/Skeleton";

export default function AdminPesanLoading() {
  return (
    <div className="space-y-5">
      <span role="status" className="sr-only">
        Memuat data…
      </span>
      <SkeletonPageTitle />
      <div className="flex gap-1.5">
        {["w-16", "w-24", "w-20"].map((width) => (
          <Skeleton key={width} className={`h-8 ${width} rounded-md`} />
        ))}
      </div>
      <SkeletonRows count={6} />
    </div>
  );
}
