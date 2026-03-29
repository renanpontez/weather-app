import { Skeleton } from "@/components/common/Skeleton";

export function MainWeatherSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Skeleton className="h-9 w-40 rounded-full" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-32 w-48 rounded-full md:h-40 md:w-56" />
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>
      <Skeleton className="h-5 w-32 rounded-full" />
      <Skeleton className="h-4 w-24 rounded-full" />
      <div className="mt-2 flex gap-5">
        <Skeleton className="h-4 w-16 rounded-full" />
        <Skeleton className="h-4 w-12 rounded-full" />
        <Skeleton className="h-4 w-16 rounded-full" />
      </div>
    </div>
  );
}
