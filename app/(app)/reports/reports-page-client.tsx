"use client"

import {
  UsersIcon,
  CircleCheckBigIcon,
  ActivityIcon,
  CalendarCheckIcon,
  TrendingUpIcon,
} from "lucide-react"

import { useTranslation } from "@/hooks/use-translation"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { BarChart } from "@/components/bar-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ReportStats {
  patientsThisMonth: number
  completedTreatments: number
  averageSessions: number
  totalAppointments: number
  attendanceRate: number
}

export function ReportsPageClient({
  reportStats,
  patientsPerMonth,
  sessionsPerWeek,
}: {
  reportStats: ReportStats
  patientsPerMonth: { month: string; patients: number }[]
  sessionsPerWeek: { week: string; sessions: number }[]
}) {
  const { t } = useTranslation()
  const patientsData = patientsPerMonth.map((d) => ({
    label: d.month,
    value: d.patients,
  }))
  const sessionsData = sessionsPerWeek.map((d) => ({
    label: d.week,
    value: d.sessions,
  }))

  return (
    <>
      <PageHeader
        title={t.reports.title}
        description={t.reports.subtitle}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          label={t.reports.patientsThisMonth}
          value={reportStats.patientsThisMonth}
          icon={UsersIcon}
        />
        <StatCard
          label={t.reports.completedTreatments}
          value={reportStats.completedTreatments}
          icon={CircleCheckBigIcon}
          iconClassName="bg-success/15 text-success"
        />
        <StatCard
          label={t.reports.averageSessions}
          value={reportStats.averageSessions}
          icon={ActivityIcon}
          iconClassName="bg-accent/15 text-accent"
        />
        <StatCard
          label={t.reports.totalAppointments}
          value={reportStats.totalAppointments}
          icon={CalendarCheckIcon}
        />
        <StatCard
          label={t.reports.attendanceRate}
          value={`${reportStats.attendanceRate}%`}
          icon={TrendingUpIcon}
          iconClassName="bg-success/15 text-success"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t.reports.patientsPerMonth}</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={patientsData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.reports.sessionsPerWeek}</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={sessionsData} color="bg-accent" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.reports.attendanceRate}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {t.reports.attendanceRateDesc}
            </span>
            <span className="font-semibold tabular-nums">
              {reportStats.attendanceRate}%
            </span>
          </div>
          <Progress value={reportStats.attendanceRate} />
        </CardContent>
      </Card>
    </>
  )
}
