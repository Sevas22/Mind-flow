import { requireUser } from "@/lib/auth/dal"
import { getReportStats, getPatientsPerMonth, getSessionsPerWeek } from "@/lib/data/reports"
import { ReportsPageClient } from "@/app/(app)/reports/reports-page-client"

export default async function ReportsPage() {
  const user = await requireUser()

  const [reportStats, patientsPerMonth, sessionsPerWeek] = await Promise.all([
    getReportStats(user.id),
    getPatientsPerMonth(user.id),
    getSessionsPerWeek(user.id),
  ])

  return (
    <ReportsPageClient
      reportStats={reportStats}
      patientsPerMonth={patientsPerMonth}
      sessionsPerWeek={sessionsPerWeek}
    />
  )
}
