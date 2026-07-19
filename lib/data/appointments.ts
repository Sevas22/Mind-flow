import "server-only"
import { prisma } from "@/lib/prisma"

export async function getAppointments(userId: string) {
  const appointments = await prisma.appointment.findMany({
    where: { userId },
    orderBy: { startAt: "asc" },
    include: { patient: { select: { name: true } } },
  })
  return appointments.map((a) => ({ ...a, patientName: a.patient.name }))
}

export async function getAppointment(userId: string, id: string) {
  const a = await prisma.appointment.findFirst({
    where: { id, userId },
    include: { patient: { select: { name: true } } },
  })
  if (!a) return null
  return { ...a, patientName: a.patient.name }
}
