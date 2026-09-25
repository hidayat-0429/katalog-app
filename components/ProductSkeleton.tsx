/**
 * ProductSkeleton - Skeleton loader for product cards
 * Used during data loading states
 */
export default function ProductSkeleton() {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full aspect-square bg-neutral-200 dark:bg-neutral-700" />

      {/* Content Skeleton */}
      <div className="flex-1 p-4 space-y-3">
        {/* Category Badge */}
        <div className="h-5 w-16 bg-neutral-200 dark:bg-neutral-700 rounded" />

        {/* Product Name */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded" />
          <div className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded" />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price & Stock */}
        <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-700">
          <div className="h-5 w-24 bg-neutral-200 dark:bg-neutral-700 rounded" />
          <div className="h-4 w-20 bg-neutral-200 dark:bg-neutral-700 rounded" />
        </div>

        {/* Button */}
        <div className="h-9 w-full bg-neutral-200 dark:bg-neutral-700 rounded" />
      </div>
    </div>
  );
}

/**
 * ProductSkeletonGrid - Grid of skeleton loaders
 */
interface ProductSkeletonGridProps {
  count?: number;
  cols?: number;
}

export function ProductSkeletonGrid({ count = 4, cols = 4 }: ProductSkeletonGridProps) {
  return (
    <div
      className="grid gap-5"
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(240px, 1fr))`,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
