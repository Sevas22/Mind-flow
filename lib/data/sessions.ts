import "server-only"
import { prisma } from "@/lib/prisma"

export async function getSessions(userId: string) {
  const sessions = await prisma.session.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    include: { patient: { select: { name: true } } },
  })
  return sessions.map((s) => ({ ...s, patientName: s.patient.name }))
}

export async function getSession(userId: string, id: string) {
  const s = await prisma.session.findFirst({
    where: { id, userId },
    include: { patient: { select: { name: true } } },
  })
  if (!s) return null
  return { ...s, patientName: s.patient.name }
}

export async function getPatientSessions(userId: string, patientId: string) {
  const sessions = await prisma.session.findMany({
    where: { userId, patientId },
    orderBy: { number: "desc" },
    include: { patient: { select: { name: true } } },
  })
  return sessions.map((s) => ({ ...s, patientName: s.patient.name }))
}

export async function getNextSessionNumber(patientId: string) {
  const last = await prisma.session.findFirst({
    where: { patientId },
    orderBy: { number: "desc" },
    select: { number: true },
  })
  return (last?.number ?? 0) + 1
}
