"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth/dal"
import {
  createPatientSchema,
  treatmentApproachTags,
  patientStatusSchema,
  updatePatientSchema,
} from "@/lib/validation/patient"
import { createHomeworkSchema } from "@/lib/validation/homework"
import type { FormState } from "@/actions/types"

export async function createPatient(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser()

  const parsed = createPatientSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const { name, age, email, reason, treatmentGoal, totalSessions, approach } = parsed.data

  await prisma.patient.create({
    data: {
      userId: user.id,
      name,
      age,
      email: email || null,
      reason,
      treatmentGoal: treatmentGoal || `Support ${name.split(" ")[0]} through treatment for ${reason.toLowerCase()}.`,
      totalSessions,
      tags: treatmentApproachTags[approach] ?? [],
      startedAt: new Date(),
    },
  })

  revalidatePath("/patients")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function toggleHomeworkItem(homeworkItemId: string, done: boolean): Promise<void> {
  const user = await requireUser()

  const item = await prisma.homeworkItem.findFirst({
    where: { id: homeworkItemId, patient: { userId: user.id } },
    select: { patientId: true },
  })
  if (!item) return

  await prisma.homeworkItem.update({
    where: { id: homeworkItemId },
    data: { done },
  })

  revalidatePath(`/patients/${item.patientId}`)
}

export async function createHomeworkItem(
  patientId: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser()

  const parsed = createHomeworkSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const patient = await prisma.patient.findFirst({
    where: { id: patientId, userId: user.id },
    select: { id: true },
  })
  if (!patient) return { error: "Patient not found." }

  const count = await prisma.homeworkItem.count({ where: { patientId } })

  await prisma.homeworkItem.create({
    data: { patientId, task: parsed.data.task, order: count },
  })

  revalidatePath(`/patients/${patientId}`)
  return { success: true }
}

export async function deleteHomeworkItem(homeworkItemId: string): Promise<void> {
  const user = await requireUser()

  const item = await prisma.homeworkItem.findFirst({
    where: { id: homeworkItemId, patient: { userId: user.id } },
    select: { patientId: true },
  })
  if (!item) return

  await prisma.homeworkItem.delete({ where: { id: homeworkItemId } })

  revalidatePath(`/patients/${item.patientId}`)
}

export async function updatePatient(
  patientId: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser()

  const parsed = updatePatientSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const { name, age, email, phone, reason, treatmentGoal, totalSessions, status } = parsed.data

  const result = await prisma.patient.updateMany({
    where: { id: patientId, userId: user.id },
    data: {
      name,
      age,
      email: email || null,
      phone: phone || null,
      reason,
      treatmentGoal,
      totalSessions,
      status,
    },
  })
  if (result.count === 0) return { error: "Patient not found." }

  revalidatePath(`/patients/${patientId}`)
  revalidatePath("/patients")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function deletePatient(
  patientId: string,
): Promise<{ ok: boolean; error?: string }> {
  const user = await requireUser()

  const result = await prisma.patient.deleteMany({
    where: { id: patientId, userId: user.id },
  })
  if (result.count === 0) return { ok: false, error: "Patient not found." }

  revalidatePath("/patients")
  revalidatePath("/dashboard")
  return { ok: true }
}

export async function setPatientStatus(patientId: string, status: string): Promise<void> {
  const user = await requireUser()
  const parsedStatus = patientStatusSchema.safeParse(status)
  if (!parsedStatus.success) return

  const result = await prisma.patient.updateMany({
    where: { id: patientId, userId: user.id },
    data: { status: parsedStatus.data },
  })
  if (result.count === 0) return

  revalidatePath(`/patients/${patientId}`)
  revalidatePath("/patients")
  revalidatePath("/dashboard")
}
