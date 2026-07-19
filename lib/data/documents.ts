import "server-only"
import { prisma } from "@/lib/prisma"

export async function getPatientDocuments(userId: string, patientId: string) {
  return prisma.patientDocument.findMany({
    where: { userId, patientId },
    orderBy: { uploadedAt: "desc" },
  })
}
