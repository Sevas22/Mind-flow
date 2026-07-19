import { Skeleton } from "@/components/ui/skeleton"

export default function SessionDetailLoading() {
  return (
    <>
      <Skeleton className="h-8 w-36" />
      <Skeleton className="h-24 rounded-xl" />
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    </>
  )
}
