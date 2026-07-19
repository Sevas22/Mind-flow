import "server-only"
import { prisma } from "@/lib/prisma"
import type { PatientStatus } from "@/lib/generated/prisma/client"
import type { PatientListRow, PatientDetail } from "@/lib/serializers/patient"
import { getAvatarColor, getInitials } from "@/lib/avatar"

export async function getPatients(
  userId: string,
  opts: { search?: string; status?: PatientStatus | "all" } = {},
): Promise<PatientListRow[]> {
  const { search, status } = opts

  const patients = await prisma.patient.findMany({
    where: {
      userId,
      ...(status && status !== "all" ? { status } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { reason: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      sessions: {
        where: { status: "completed" },
        orderBy: { date: "desc" },
        take: 1,
      },
      appointments: {
        where: { status: "scheduled", startAt: { gte: new Date() } },
        orderBy: { startAt: "asc" },
        take: 1,
      },
      _count: {
        select: { sessions: { where: { status: "completed" } } },
      },
    },
  })

  return patients.map((p) => {
    const { sessions, appointments, _count, ...rest } = p
    return {
      ...rest,
      completedSessionsCount: _count.sessions,
      lastCompletedSession: sessions[0] ?? null,
      nextUpcomingAppointment: appointments[0] ?? null,
    }
  })
}

export async function getPatient(
  userId: string,
  patientId: string,
): Promise<PatientDetail | null> {
  const patient = await prisma.patient.findFirst({
    where: { id: patientId, userId },
    include: {
      sessions: {
        where: { status: "completed" },
        orderBy: { date: "desc" },
        take: 1,
      },
      appointments: {
        where: { status: "scheduled", startAt: { gte: new Date() } },
        orderBy: { startAt: "asc" },
        take: 1,
      },
      homework: { orderBy: { order: "asc" } },
      reminders: { orderBy: [{ done: "asc" }, { due: "asc" }], take: 25 },
      _count: {
        select: { sessions: { where: { status: "completed" } } },
      },
    },
  })

  if (!patient) return null

  const { sessions, appointments, homework, reminders, _count, ...rest } = patient
  return {
    ...rest,
    completedSessionsCount: _count.sessions,
    lastCompletedSession: sessions[0] ?? null,
    nextUpcomingAppointment: appointments[0] ?? null,
    homework,
    reminders,
  }
}

export async function getActivePatientOptions(userId: string) {
  return prisma.patient.findMany({
    where: { userId, status: "active" },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })
}

export async function getPatientSearchIndex(userId: string) {
  const patients = await prisma.patient.findMany({
    where: { userId },
    select: { id: true, name: true, reason: true, status: true },
    orderBy: { name: "asc" },
  })
  return patients.map((p) => ({
    ...p,
    avatarColor: getAvatarColor(p.id),
    initials: getInitials(p.name),
  }))
}
