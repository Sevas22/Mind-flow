"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth/dal"
import { reminderSchema } from "@/lib/validation/reminder"
import { combineDateTime } from "@/lib/serializers/format-helpers"
import type { FormState } from "@/actions/types"

export async function createReminder(
  patientId: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser()

  const parsed = reminderSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const patient = await prisma.patient.findFirst({
    where: { id: patientId, userId: user.id },
    select: { id: true },
  })
  if (!patient) return { error: "Patient not found." }

  const { text, due, priority } = parsed.data

  await prisma.reminder.create({
    data: {
      userId: user.id,
      patientId,
      text,
      due: combineDateTime(due, "00:00"),
      priority,
    },
  })

  revalidatePath(`/patients/${patientId}`)
  revalidatePath("/dashboard")
  return { success: true }
}

export async function updateReminder(
  reminderId: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser()

  const parsed = reminderSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const reminder = await prisma.reminder.findFirst({
    where: { id: reminderId, userId: user.id },
    select: { patientId: true },
  })
  if (!reminder) return { error: "Reminder not found." }

  const { text, due, priority } = parsed.data

  await prisma.reminder.update({
    where: { id: reminderId },
    data: { text, due: combineDateTime(due, "00:00"), priority },
  })

  revalidatePath(`/patients/${reminder.patientId}`)
  revalidatePath("/dashboard")
  return { success: true }
}

export async function toggleReminderDone(reminderId: string, done: boolean): Promise<void> {
  const user = await requireUser()

  const reminder = await prisma.reminder.findFirst({
    where: { id: reminderId, userId: user.id },
    select: { patientId: true },
  })
  if (!reminder) return

  await prisma.reminder.update({ where: { id: reminderId }, data: { done } })

  revalidatePath(`/patients/${reminder.patientId}`)
  revalidatePath("/dashboard")
}

export async function deleteReminder(reminderId: string): Promise<void> {
  const user = await requireUser()

  const reminder = await prisma.reminder.findFirst({
    where: { id: reminderId, userId: user.id },
    select: { patientId: true },
  })
  if (!reminder) return

  await prisma.reminder.delete({ where: { id: reminderId } })

  revalidatePath(`/patients/${reminder.patientId}`)
  revalidatePath("/dashboard")
}
