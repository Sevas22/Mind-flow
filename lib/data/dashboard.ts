import "server-only"
import { startOfDay, endOfDay, startOfWeek, endOfWeek, addDays } from "date-fns"

import { prisma } from "@/lib/prisma"
import { toDateStr } from "@/lib/serializers/format-helpers"

export async function getDashboardStats(userId: string) {
  const now = new Date()
  const todayStart = startOfDay(now)
  const todayEnd = endOfDay(now)
  const weekStart = startOfWeek(now, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 })

  const [
    todayAppointments,
    upcomingAppointments,
    activePatients,
    completedTreatments,
    weekSessions,
    completedAppts,
    sessionRows,
  ] = await Promise.all([
    prisma.appointment.count({
      where: { userId, startAt: { gte: todayStart, lte: todayEnd } },
    }),
    prisma.appointment.count({
      where: {
        userId,
        status: "scheduled",
        startAt: { gt: todayEnd, lte: addDays(todayEnd, 7) },
      },
    }),
    prisma.patient.count({ where: { userId, status: "active" } }),
    prisma.patient.count({ where: { userId, status: "finished" } }),
    prisma.session.count({
      where: { userId, date: { gte: weekStart, lte: weekEnd } },
    }),
    prisma.appointment.findMany({
      where: { userId, status: "completed" },
      select: { patientId: true, startAt: true },
    }),
    prisma.session.findMany({
      where: { userId },
      select: { patientId: true, date: true },
    }),
  ])

  const sessionKeys = new Set(
    sessionRows.map((s) => `${s.patientId}:${toDateStr(s.date)}`),
  )
  const pendingNotes = completedAppts.filter(
    (a) => !sessionKeys.has(`${a.patientId}:${toDateStr(a.startAt)}`),
  ).length

  return {
    todayAppointments,
    upcomingAppointments,
    activePatients,
    completedTreatments,
    pendingNotes,
    weekSessions,
  }
}

export async function getTodaySchedule(userId: string) {
  const now = new Date()
  const appointments = await prisma.appointment.findMany({
    where: { userId, startAt: { gte: startOfDay(now), lte: endOfDay(now) } },
    orderBy: { startAt: "asc" },
    include: { patient: { select: { name: true } } },
  })
  return appointments.map((a) => ({ ...a, patientName: a.patient.name }))
}
