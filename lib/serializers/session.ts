import type { Session } from "@/lib/generated/prisma/client"
import { toDateStr, toTimeStr } from "@/lib/serializers/format-helpers"

export interface SessionWithPatientName extends Session {
  patientName: string
}

export function serializeSession(s: SessionWithPatientName) {
  return {
    id: s.id,
    patientId: s.patientId,
    patientName: s.patientName,
    number: s.number,
    date: toDateStr(s.date),
    time: toTimeStr(s.date),
    status: s.status,
    duration: s.duration,
    mood: s.mood ?? "neutral",
    reason: s.reason,
    objectives: s.objectives,
    topics: s.topics,
    interventions: s.interventions,
    techniques: s.techniques,
    homework: s.homework,
    achievements: s.achievements,
    observations: s.observations,
    nextReminder: s.nextReminder ?? "",
    risk: s.risk,
    followUp: s.followUp ?? "",
  }
}

export type SerializedSession = ReturnType<typeof serializeSession>
