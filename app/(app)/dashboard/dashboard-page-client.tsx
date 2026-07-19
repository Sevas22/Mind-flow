"use client"

import Link from "next/link"
import {
  CalendarCheckIcon,
  CalendarClockIcon,
  UsersIcon,
  CircleCheckBigIcon,
  FileClockIcon,
  ActivityIcon,
  ArrowRightIcon,
  BellIcon,
} from "lucide-react"

import type { Appointment, Patient, Reminder } from "@/lib/types"
import { formatDate, relativeDay } from "@/lib/format"
import { useTranslation } from "@/hooks/use-translation"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { AppointmentCard } from "@/components/appointment-card"
import { AppointmentActionsMenu } from "@/components/appointment-actions-menu"
import { QuickActions } from "@/components/quick-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function firstName(fullName: string) {
  const parts = fullName.trim().split(/\s+/)
  return parts.length > 2 ? parts[1] : parts[0]
}

interface DashboardStats {
  todayAppointments: number
  upcomingAppointments: number
  activePatients: number
  completedTreatments: number
  pendingNotes: number
  weekSessions: number
}

export function DashboardPageClient({
  therapistName,
  todayIso,
  stats,
  todaySchedule,
  reminders,
  recentPatients,
  patientOptions,
}: {
  therapistName: string
  todayIso: string
  stats: DashboardStats
  todaySchedule: Appointment[]
  reminders: Reminder[]
  recentPatients: Patient[]
  patientOptions: { id: string; name: string }[]
}) {
  const { t } = useTranslation()

  return (
    <>
      <PageHeader
        title={`${t.dashboard.goodMorning} ${firstName(therapistName)}`}
        description={`${t.dashboard.scheduleIntro} ${formatDate(todayIso, "full")}.`}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label={t.dashboard.statTodayAppointments}
          value={stats.todayAppointments}
          icon={CalendarCheckIcon}
        />
        <StatCard
          label={t.dashboard.statUpcoming}
          value={stats.upcomingAppointments}
          icon={CalendarClockIcon}
          iconClassName="bg-accent/15 text-accent"
          hint={t.dashboard.statUpcomingHint}
        />
        <StatCard
          label={t.dashboard.statActivePatients}
          value={stats.activePatients}
          icon={UsersIcon}
          iconClassName="bg-success/15 text-success"
        />
        <StatCard
          label={t.dashboard.statCompletedTreatments}
          value={stats.completedTreatments}
          icon={CircleCheckBigIcon}
          iconClassName="bg-success/15 text-success"
        />
        <StatCard
          label={t.dashboard.statPendingNotes}
          value={stats.pendingNotes}
          icon={FileClockIcon}
          iconClassName="bg-warning/20 text-warning"
          hint={t.dashboard.statPendingNotesHint}
        />
        <StatCard
          label={t.dashboard.statWeekSessions}
          value={stats.weekSessions}
          icon={ActivityIcon}
          iconClassName="bg-primary/10 text-primary"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex flex-col gap-1">
              <CardTitle>{t.dashboard.todaysSchedule}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {todaySchedule.length} {t.dashboard.appointments} · {formatDate(todayIso, "short")}
              </p>
            </div>
            <Button variant="outline" size="sm" nativeButton={false} render={<Link href="/calendar" />}>
              {t.dashboard.viewCalendar}
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5">
            {todaySchedule.length > 0 ? (
              todaySchedule.map((a) => (
                <AppointmentCard
                  key={a.id}
                  appointment={a}
                  actions={<AppointmentActionsMenu appointment={a} />}
                />
              ))
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">
                {t.calendar.noAppointmentsDesc}
              </p>
            )}
          </CardContent>
        </Card>

        <QuickActions patients={patientOptions} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-warning/20 text-warning">
              <BellIcon className="size-4" />
            </span>
            <CardTitle>{t.dashboard.upcomingReminders}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {reminders.map((r) => (
              <Link
                key={r.id}
                href={`/patients/${r.patientId}`}
                className="flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-muted/60"
              >
                <span
                  className={`mt-1 size-2 shrink-0 rounded-full ${
                    r.priority === "high"
                      ? "bg-destructive"
                      : r.priority === "medium"
                        ? "bg-warning"
                        : "bg-muted-foreground"
                  }`}
                />
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="text-sm font-medium leading-tight">
                    {r.text}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {r.patientName} · {relativeDay(r.due)}
                  </span>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t.dashboard.recentPatients}</CardTitle>
            <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/patients" />}>
              {t.dashboard.seeAll}
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border">
            {recentPatients.map((p) => (
              <Link
                key={p.id}
                href={`/patients/${p.id}`}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <Avatar className={`size-9 ${p.avatarColor}`}>
                  <AvatarFallback className={p.avatarColor}>
                    {p.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium">{p.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {p.reason}
                  </span>
                </div>
                <div className="hidden flex-col items-end sm:flex">
                  <span className="text-xs font-medium">
                    {p.sessionsCompleted}/{p.totalSessions} {t.dashboard.sessionsWord}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {p.lastSession ? `${t.dashboard.lastWord} ${formatDate(p.lastSession, "short")}` : "—"}
                  </span>
                </div>
                <Badge variant="secondary" className="hidden md:flex">
                  {p.tags[0]}
                </Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
