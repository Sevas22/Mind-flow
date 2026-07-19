"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth/dal"
import { createNoteSchema } from "@/lib/validation/note"
import type { FormState } from "@/actions/types"

export async function createNote(
  patientId: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser()

  const parsed = createNoteSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const patient = await prisma.patient.findFirst({
    where: { id: patientId, userId: user.id },
    select: { id: true },
  })
  if (!patient) return { error: "Patient not found." }

  await prisma.quickNote.create({
    data: { userId: user.id, patientId, text: parsed.data.text },
  })

  revalidatePath(`/patients/${patientId}`)
  return { success: true }
}
