"use server"

import { revalidatePath } from "next/cache"
import { addMinutes } from "date-fns"

import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth/dal"
import {
  createAppointmentSchema,
  reminderLeadTimeToEnum,
  rescheduleAppointmentSchema,
} from "@/lib/validation/appointment"
import { combineDateTime } from "@/lib/serializers/format-helpers"
import type { FormState } from "@/actions/types"

export async function createAppointment(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser()

  const parsed = createAppointmentSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const { patientId, date, time, duration, location, status, reminder, notes } = parsed.data

  const patient = await prisma.patient.findFirst({
    where: { id: patientId, userId: user.id },
    select: { id: true },
  })
  if (!patient) return { error: "Patient not found." }

  const startAt = combineDateTime(date, time)
  const endAt = addMinutes(startAt, duration)

  await prisma.appointment.create({
    data: {
      userId: user.id,
      patientId,
      startAt,
      endAt,
      location,
      status,
      notes: notes || null,
      reminderLeadTime: reminderLeadTimeToEnum[reminder],
    },
  })

  revalidatePath("/calendar")
  revalidatePath("/dashboard")
  revalidatePath(`/patients/${patientId}`)
  return { success: true }
}

export async function rescheduleAppointment(
  id: string,
  date: string,
  startTime: string,
): Promise<{ ok: boolean; error?: string }> {
  const user = await requireUser()

  const parsed = rescheduleAppointmentSchema.safeParse({ id, date, startTime })
  if (!parsed.success) return { ok: false, error: "Invalid reschedule request." }

  const appointment = await prisma.appointment.findFirst({
    where: { id, userId: user.id },
  })
  if (!appointment) return { ok: false, error: "Appointment not found." }

  const durationMinutes = Math.round(
    (appointment.endAt.getTime() - appointment.startAt.getTime()) / 60000,
  )
  const newStart = combineDateTime(date, startTime)
  const newEnd = addMinutes(newStart, durationMinutes)

  await prisma.appointment.update({
    where: { id },
    data: { startAt: newStart, endAt: newEnd },
  })

  revalidatePath("/calendar")
  revalidatePath("/dashboard")
  return { ok: true }
}

export async function updateAppointmentStatus(
  id: string,
  status: "scheduled" | "completed" | "cancelled" | "missed",
): Promise<{ ok: boolean; error?: string }> {
  const user = await requireUser()

  const result = await prisma.appointment.updateMany({
    where: { id, userId: user.id },
    data: { status },
  })
  if (result.count === 0) return { ok: false, error: "Appointment not found." }

  revalidatePath("/calendar")
  revalidatePath("/dashboard")
  return { ok: true }
}
