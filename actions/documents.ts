"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth/dal"
import { documentCategorySchema } from "@/lib/validation/document"
import type { FormState } from "@/actions/types"

export async function createDocumentMetadata(
  patientId: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser()

  const file = formData.get("file")
  if (!(file instanceof File) || !file.name) {
    return { fieldErrors: { file: ["Choose a file"] } }
  }

  const categoryParsed = documentCategorySchema.safeParse(formData.get("category"))
  if (!categoryParsed.success) {
    return { fieldErrors: { category: ["Choose a category"] } }
  }

  const patient = await prisma.patient.findFirst({
    where: { id: patientId, userId: user.id },
    select: { id: true },
  })
  if (!patient) return { error: "Patient not found." }

  await prisma.patientDocument.create({
    data: {
      userId: user.id,
      patientId,
      name: file.name,
      category: categoryParsed.data,
      sizeBytes: file.size,
    },
  })

  revalidatePath(`/patients/${patientId}`)
  return { success: true }
}
