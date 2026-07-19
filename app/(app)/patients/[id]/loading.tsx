import { Skeleton } from "@/components/ui/skeleton"

export default function PatientProfileLoading() {
  return (
    <>
      <Skeleton className="h-8 w-36" />
      <Skeleton className="h-32 rounded-xl" />
      <Skeleton className="h-56 rounded-xl" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-80" />
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    </>
  )
}
