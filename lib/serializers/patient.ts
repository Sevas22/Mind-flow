import type {
  Patient,
  HomeworkItem,
  Session,
  Appointment,
  Reminder,
} from "@/lib/generated/prisma/client"
import { getInitials, getAvatarColor } from "@/lib/avatar"
import { toDateStr } from "@/lib/serializers/format-helpers"

export interface PatientListRow extends Patient {
  completedSessionsCount: number
  lastCompletedSession: Session | null
  nextUpcomingAppointment: Appointment | null
}

export interface PatientDetail extends PatientListRow {
  homework: HomeworkItem[]
  reminders: Reminder[]
}

function baseFields(p: Patient) {
  return {
    id: p.id,
    name: p.name,
    age: p.age,
    email: p.email ?? "",
    phone: p.phone ?? "",
    avatarColor: getAvatarColor(p.id),
    initials: getInitials(p.name),
    status: p.status,
    reason: p.reason,
    treatmentGoal: p.treatmentGoal,
    progress: p.progress,
    totalSessions: p.totalSessions,
    tags: p.tags,
    alerts: p.alerts,
    startedAt: toDateStr(p.startedAt),
  }
}

export function serializePatientCard(p: PatientListRow) {
  return {
    ...baseFields(p),
    sessionsCompleted: p.completedSessionsCount,
    lastSession: p.lastCompletedSession ? toDateStr(p.lastCompletedSession.date) : null,
    nextAppointment: p.nextUpcomingAppointment
      ? toDateStr(p.nextUpcomingAppointment.startAt)
      : null,
  }
}

export function serializePatientDetail(p: PatientDetail) {
  const last = p.lastCompletedSession
  const pendingReminders = p.reminders.filter((r) => !r.done)
  return {
    ...baseFields(p),
    sessionsCompleted: p.completedSessionsCount,
    lastSession: last ? toDateStr(last.date) : null,
    nextAppointment: p.nextUpcomingAppointment
      ? toDateStr(p.nextUpcomingAppointment.startAt)
      : null,
    currentHomework: p.homework.map((h) => ({
      id: h.id,
      task: h.task,
      done: h.done,
    })),
    reminders: p.reminders.map((r) => ({
      id: r.id,
      text: r.text,
      due: toDateStr(r.due),
      priority: r.priority,
      done: r.done,
    })),
    lastSummary: {
      topics: last?.topics ?? [],
      achievements: last?.achievements ?? [],
      homework: last?.homework ?? [],
      remember: pendingReminders.slice(0, 3).map((r) => r.text),
    },
  }
}

export type SerializedPatientCard = ReturnType<typeof serializePatientCard>
export type SerializedPatientDetail = ReturnType<typeof serializePatientDetail>
