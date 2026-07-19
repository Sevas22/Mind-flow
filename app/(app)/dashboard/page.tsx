import { requireUser } from "@/lib/auth/dal"
import { getDashboardStats, getTodaySchedule } from "@/lib/data/dashboard"
import { getPatients } from "@/lib/data/patients"
import { getUpcomingReminders } from "@/lib/data/reminders"
import { serializeAppointment } from "@/lib/serializers/appointment"
import { serializePatientCard } from "@/lib/serializers/patient"
import { serializeReminder } from "@/lib/serializers/reminder"
import { toDateStr } from "@/lib/serializers/format-helpers"
import { DashboardPageClient } from "@/app/(app)/dashboard/dashboard-page-client"

export default async function DashboardPage() {
  const user = await requireUser()

  const [stats, todaySchedule, reminders, activePatients] = await Promise.all([
    getDashboardStats(user.id),
    getTodaySchedule(user.id),
    getUpcomingReminders(user.id, 5),
    getPatients(user.id, { status: "active" }),
  ])

  return (
    <DashboardPageClient
      therapistName={user.name}
      todayIso={toDateStr(new Date())}
      stats={stats}
      todaySchedule={todaySchedule.map(serializeAppointment)}
      reminders={reminders.map(serializeReminder)}
      recentPatients={activePatients.slice(0, 4).map(serializePatientCard)}
      patientOptions={activePatients.map((p) => ({ id: p.id, name: p.name }))}
    />
  )
}
