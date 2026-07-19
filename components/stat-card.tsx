import type { LucideIcon } from "lucide-react"
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  iconClassName?: string
  trend?: { value: string; direction: "up" | "down" }
  hint?: string
}

export function StatCard({
  label,
  value,
  icon: Icon,
  iconClassName,
  trend,
  hint,
}: StatCardProps) {
  return (
    <Card className="gap-0 py-0">
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span
            className={cn(
              "flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary [&_svg]:size-4.5",
              iconClassName,
            )}
          >
            <Icon />
          </span>
        </div>
        <div className="flex items-end justify-between gap-2">
          <span className="text-3xl font-semibold tracking-tight tabular-nums">
            {value}
          </span>
          {trend && (
            <span
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                trend.direction === "up" ? "text-success" : "text-destructive",
              )}
            >
              {trend.direction === "up" ? (
                <TrendingUpIcon className="size-3.5" />
              ) : (
                <TrendingDownIcon className="size-3.5" />
              )}
              {trend.value}
            </span>
          )}
        </div>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  )
}
