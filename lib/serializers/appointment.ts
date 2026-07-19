import type { Appointment } from "@/lib/generated/prisma/client"
import { getInitials, getAvatarColor } from "@/lib/avatar"
import { toDateStr, toTimeStr } from "@/lib/serializers/format-helpers"

export interface AppointmentWithPatientName extends Appointment {
  patientName: string
}

const leadTimeLabel: Record<Appointment["reminderLeadTime"], string> = {
  oneHour: "1 hour before",
  oneDay: "1 day before",
  none: "No reminder",
}

export function serializeAppointment(a: AppointmentWithPatientName) {
  const durationMinutes = Math.round(
    (a.endAt.getTime() - a.startAt.getTime()) / 60000,
  )
  return {
    id: a.id,
    patientId: a.patientId,
    patientName: a.patientName,
    initials: getInitials(a.patientName),
    avatarColor: getAvatarColor(a.patientId),
    date: toDateStr(a.startAt),
    startTime: toTimeStr(a.startAt),
    endTime: toTimeStr(a.endAt),
    duration: durationMinutes,
    location: a.location,
    status: a.status,
    notes: a.notes ?? "",
    reminder: leadTimeLabel[a.reminderLeadTime],
  }
}

export type SerializedAppointment = ReturnType<typeof serializeAppointment>
