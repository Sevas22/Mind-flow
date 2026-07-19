import "server-only"
import { format, subMonths, startOfMonth, startOfWeek, subWeeks } from "date-fns"

import { prisma } from "@/lib/prisma"

export async function getReportStats(userId: string) {
  const now = new Date()
  const monthStart = startOfMonth(now)

  const [
    patientsThisMonth,
    completedTreatments,
    totalPatients,
    completedSessionsCount,
    totalAppointments,
    completedAppointments,
    missedAppointments,
  ] = await Promise.all([
    prisma.patient.count({ where: { userId, startedAt: { gte: monthStart } } }),
    prisma.patient.count({ where: { userId, status: "finished" } }),
    prisma.patient.count({ where: { userId } }),
    prisma.session.count({ where: { userId, status: "completed" } }),
    prisma.appointment.count({ where: { userId } }),
    prisma.appointment.count({ where: { userId, status: "completed" } }),
    prisma.appointment.count({ where: { userId, status: "missed" } }),
  ])

  const averageSessions =
    totalPatients > 0 ? Math.round((completedSessionsCount / totalPatients) * 10) / 10 : 0

  const attendanceDenominator = completedAppointments + missedAppointments
  const attendanceRate =
    attendanceDenominator > 0
      ? Math.round((completedAppointments / attendanceDenominator) * 100)
      : 100

  return {
    patientsThisMonth,
    completedTreatments,
    averageSessions,
    totalAppointments,
    attendanceRate,
  }
}

export async function getPatientsPerMonth(userId: string) {
  const now = new Date()
  const months = Array.from({ length: 7 }, (_, i) => startOfMonth(subMonths(now, 6 - i)))
  const earliest = months[0]

  const patients = await prisma.patient.findMany({
    where: { userId, startedAt: { gte: earliest } },
    select: { startedAt: true },
  })

  return months.map((monthStart) => {
    const label = format(monthStart, "MMM")
    const count = patients.filter(
      (p) => format(startOfMonth(p.startedAt), "yyyy-MM") === format(monthStart, "yyyy-MM"),
    ).length
    return { month: label, patients: count }
  })
}

export async function getSessionsPerWeek(userId: string) {
  const now = new Date()
  const weeks = Array.from({ length: 4 }, (_, i) =>
    startOfWeek(subWeeks(now, 3 - i), { weekStartsOn: 1 }),
  )
  const earliest = weeks[0]

  const sessions = await prisma.session.findMany({
    where: { userId, date: { gte: earliest } },
    select: { date: true },
  })

  return weeks.map((weekStart, i) => {
    const count = sessions.filter(
      (s) => startOfWeek(s.date, { weekStartsOn: 1 }).getTime() === weekStart.getTime(),
    ).length
    return { week: `W${i + 1}`, sessions: count }
  })
}
