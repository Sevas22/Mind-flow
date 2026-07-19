"use client"

import Link from "next/link"
import { CheckIcon, ClockIcon, CalendarClockIcon } from "lucide-react"

import { type Session, moodLabel } from "@/lib/types"
import { formatDate } from "@/lib/format"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/hooks/use-translation"
import { Badge } from "@/components/ui/badge"

interface TimelineEntry {
  id?: string
  number: number
  date: string
  status: Session["status"]
  mood?: Session["mood"]
  reason?: string
  upcoming?: boolean
}

export function SessionTimeline({ entries }: { entries: TimelineEntry[] }) {
  const { t } = useTranslation()
  return (
    <ol className="relative flex flex-col">
      {entries.map((entry, i) => {
        const isLast = i === entries.length - 1
        const mood = entry.mood ? moodLabel(entry.mood) : null
        return (
          <li key={entry.id ?? entry.number} className="relative flex gap-4 pb-6">
            {!isLast && (
              <span className="absolute left-[15px] top-9 h-full w-px bg-border" />
            )}
            <span
              className={cn(
                "z-10 flex size-8 shrink-0 items-center justify-center rounded-full ring-4 ring-background",
                entry.upcoming
                  ? "bg-primary/15 text-primary"
                  : "bg-success/15 text-success",
              )}
            >
              {entry.upcoming ? (
                <CalendarClockIcon className="size-4" />
              ) : (
                <CheckIcon className="size-4" />
              )}
            </span>
            <div className="flex flex-1 flex-col gap-1 pt-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">
                  {entry.upcoming
                    ? t.sessionDetail.upcomingSession
                    : `${t.sessionDetail.session} ${entry.number}`}
                </span>
                {entry.upcoming ? (
                  <Badge variant="default">{t.status.scheduled}</Badge>
                ) : (
                  <Badge variant="secondary">{t.status.completed}</Badge>
                )}
                {mood && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${mood.className}`}
                  >
                    {t.mood[entry.mood!]}
                  </span>
                )}
              </div>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <ClockIcon className="size-3.5" />
                {formatDate(entry.date, "full")}
              </span>
              {entry.reason && !entry.upcoming && entry.id && (
                <Link
                  href={`/sessions/${entry.id}`}
                  className="mt-1 w-fit text-sm text-primary hover:underline"
                >
                  {t.sessionDetail.viewNotes}
                </Link>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
