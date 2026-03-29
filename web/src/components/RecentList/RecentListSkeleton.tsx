import { Skeleton } from "@/components/common/Skeleton";

export function RecentListSkeleton() {
  return (
    <div>
      <Skeleton className="mb-3 h-4 w-32 rounded-full" />
      <div className="flex gap-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-20 w-44 shrink-0 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
