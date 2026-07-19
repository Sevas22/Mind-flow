import "server-only"
import { prisma } from "@/lib/prisma"

export async function getPatientNotes(userId: string, patientId: string) {
  return prisma.quickNote.findMany({
    where: { userId, patientId },
    orderBy: { createdAt: "desc" },
  })
}
