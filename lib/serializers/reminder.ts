import type { Reminder } from "@/lib/generated/prisma/client"
import { toDateStr } from "@/lib/serializers/format-helpers"

export interface ReminderWithPatientName extends Reminder {
  patientName: string
}

export function serializeReminder(r: ReminderWithPatientName) {
  return {
    id: r.id,
    patientId: r.patientId,
    patientName: r.patientName,
    text: r.text,
    due: toDateStr(r.due),
    priority: r.priority,
  }
}

export type SerializedReminder = ReturnType<typeof serializeReminder>
