import "server-only"
import { prisma } from "@/lib/prisma"

export async function getUpcomingReminders(userId: string, take = 6) {
  const reminders = await prisma.reminder.findMany({
    where: { userId, done: false },
    orderBy: { due: "asc" },
    take,
    include: { patient: { select: { name: true } } },
  })
  return reminders.map((r) => ({ ...r, patientName: r.patient.name }))
}
