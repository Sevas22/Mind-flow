"use client"

import Link from "next/link"
import { MapPinIcon } from "lucide-react"

import { type Appointment, statusBadge } from "@/lib/types"
import { formatTime } from "@/lib/format"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/hooks/use-translation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const accentByStatus: Record<Appointment["status"], string> = {
  completed: "border-l-success",
  scheduled: "border-l-primary",
  cancelled: "border-l-muted-foreground/40",
  missed: "border-l-destructive",
}

export function AppointmentCard({
  appointment,
  compact = false,
  actions,
}: {
  appointment: Appointment
  compact?: boolean
  actions?: React.ReactNode
}) {
  const { t } = useTranslation()
  const status = statusBadge(appointment.status)

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border border-l-4 border-border bg-card p-3 transition-colors hover:bg-muted/50",
        accentByStatus[appointment.status],
        appointment.status === "cancelled" && "opacity-70",
      )}
    >
      <Link
        href={`/patients/${appointment.patientId}`}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        <div className="flex w-16 shrink-0 flex-col items-center">
          <span className="text-sm font-semibold tabular-nums">
            {formatTime(appointment.startTime)}
          </span>
          <span className="text-xs text-muted-foreground">
            {appointment.duration}m
          </span>
        </div>
        <Avatar className={`size-9 ${appointment.avatarColor}`}>
          <AvatarFallback className={appointment.avatarColor}>
            {appointment.initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium">
            {appointment.patientName}
          </span>
          {!compact && (
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPinIcon className="size-3" />
              {appointment.location}
            </span>
          )}
        </div>
        <Badge variant={status.variant}>{t.status[appointment.status]}</Badge>
      </Link>
      {actions}
    </div>
  )
}
