"use client"

import Link from "next/link"
import { ClockIcon, ChevronRightIcon } from "lucide-react"

import { type Session, statusBadge, moodLabel } from "@/lib/types"
import { formatDate } from "@/lib/format"
import { useTranslation } from "@/hooks/use-translation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function SessionCard({
  session,
  showPatient = false,
}: {
  session: Session
  showPatient?: boolean
}) {
  const { t } = useTranslation()
  const status = statusBadge(session.status)
  const mood = moodLabel(session.mood)

  return (
    <Card className="group gap-0 py-0 transition-all hover:border-primary/40 hover:shadow-sm">
      <Link href={`/sessions/${session.id}`}>
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex size-11 shrink-0 flex-col items-center justify-center rounded-lg bg-muted">
            <span className="text-[10px] font-medium uppercase text-muted-foreground">
              Sess.
            </span>
            <span className="text-base font-semibold leading-none tabular-nums">
              {session.number}
            </span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-medium">
                {showPatient ? session.patientName : session.reason}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${mood.className}`}
              >
                {t.mood[session.mood]}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>{formatDate(session.date)}</span>
              <span className="flex items-center gap-1">
                <ClockIcon className="size-3" />
                {session.duration} {t.sessions.minutes}
              </span>
              {showPatient && <span>{session.reason}</span>}
            </div>
          </div>
          <Badge variant={status.variant}>{t.status[session.status]}</Badge>
          <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </CardContent>
      </Link>
    </Card>
  )
}
