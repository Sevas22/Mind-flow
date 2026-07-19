"use client"

import Link from "next/link"
import { CalendarIcon, CheckCircle2Icon } from "lucide-react"

import { type Patient, statusBadge } from "@/lib/types"
import { formatDate } from "@/lib/format"
import { useTranslation } from "@/hooks/use-translation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function PatientCard({ patient }: { patient: Patient }) {
  const { t } = useTranslation()
  const status = statusBadge(patient.status)

  return (
    <Card className="group gap-0 py-0 transition-all hover:border-primary/40 hover:shadow-md">
      <Link href={`/patients/${patient.id}`}>
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex items-start gap-3">
            <Avatar className={`size-11 ${patient.avatarColor}`}>
              <AvatarFallback className={patient.avatarColor}>
                {patient.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-medium">{patient.name}</span>
                <Badge variant={status.variant}>{t.status[patient.status]}</Badge>
              </div>
              <span className="text-sm text-muted-foreground">
                {patient.age} {t.common.years} · {patient.reason}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{t.patientProfile.overallProgress}</span>
              <span className="font-medium tabular-nums">
                {patient.progress}%
              </span>
            </div>
            <Progress value={patient.progress} />
          </div>
        </CardContent>
      </Link>
      <CardFooter className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <CheckCircle2Icon className="size-3.5 text-success" />
          {patient.sessionsCompleted}/{patient.totalSessions} {t.patients.sessionsAbbrev}
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarIcon className="size-3.5" />
          {patient.nextAppointment
            ? formatDate(patient.nextAppointment, "short")
            : t.patients.noUpcoming}
        </span>
      </CardFooter>
    </Card>
  )
}
