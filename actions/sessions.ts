"use server"

import { revalidatePath } from "next/cache"
import { addDays } from "date-fns"

import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth/dal"
import { getNextSessionNumber } from "@/lib/data/sessions"
import { createSessionSchema } from "@/lib/validation/session"
import { combineDateTime } from "@/lib/serializers/format-helpers"
import type { FormState } from "@/actions/types"

export async function createSession(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser()

  const parsed = createSessionSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const { patientId, date, time, duration, mood, reason, topics, achievements, homework, nextReminder, risk } =
    parsed.data

  const patient = await prisma.patient.findFirst({
    where: { id: patientId, userId: user.id },
    select: { id: true },
  })
  if (!patient) return { error: "Patient not found." }

  const number = await getNextSessionNumber(patientId)
  const dateTime = combineDateTime(date, time)

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      patientId,
      number,
      date: dateTime,
      status: "completed",
      duration,
      mood,
      reason,
      topics,
      achievements,
      homework,
      observations: "",
      nextReminder: nextReminder || null,
      risk,
    },
  })

  if (nextReminder) {
    await prisma.reminder.create({
      data: {
        userId: user.id,
        patientId,
        sessionId: session.id,
        text: nextReminder,
        due: addDays(dateTime, 7),
        priority: risk === "high" ? "high" : "medium",
      },
    })
  }

  revalidatePath(`/patients/${patientId}`)
  revalidatePath("/sessions")
  revalidatePath("/dashboard")
  revalidatePath("/reports")
  return { success: true }
}
