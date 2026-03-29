import { Skeleton } from "@/components/common/Skeleton";

export function WeekForecastSkeleton() {
  return (
    <section className="w-full">
      <Skeleton className="mb-3 h-4 w-44 rounded-full" />
      <div className="flex flex-col gap-2 md:grid md:grid-cols-6 md:gap-2">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    </section>
  );
}
