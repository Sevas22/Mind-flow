import { Skeleton } from "@/components/ui/skeleton"

export default function CalendarLoading() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-9 w-full max-w-md" />
      <Skeleton className="h-[600px] rounded-xl" />
    </>
  )
}
