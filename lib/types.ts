export type PatientStatus = "active" | "finished" | "archived"
export type SessionStatus = "completed" | "scheduled" | "cancelled" | "missed"
export type Mood = "positive" | "neutral" | "anxious" | "low" | "distressed"
export type RiskLevel = "low" | "moderate" | "high"

export interface LastSessionSummary {
  topics: string[]
  achievements: string[]
  homework: string[]
  remember: string[]
}

export interface Patient {
  id: string
  name: string
  age: number
  email: string
  phone: string
  avatarColor: string
  initials: string
  status: PatientStatus
  reason: string
  treatmentGoal: string
  progress: number
  sessionsCompleted: number
  totalSessions: number
  lastSession: string | null
  nextAppointment: string | null
  startedAt: string
  tags: string[]
  alerts: string[]
}

export interface PatientWithSummary extends Patient {
  lastSummary: LastSessionSummary
  currentHomework: { id: string; task: string; done: boolean }[]
  reminders: {
    id: string
    text: string
    due: string
    priority: "high" | "medium" | "low"
    done: boolean
  }[]
}

export interface Session {
  id: string
  patientId: string
  patientName: string
  number: number
  date: string
  time: string
  status: SessionStatus
  duration: number
  mood: Mood
  reason: string
  objectives: string[]
  topics: string[]
  interventions: string[]
  techniques: string[]
  homework: string[]
  achievements: string[]
  observations: string
  nextReminder: string
  risk: RiskLevel
  followUp: string
}

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  initials: string
  avatarColor: string
  date: string
  startTime: string
  endTime: string
  duration: number
  location: string
  status: SessionStatus
  notes: string
  reminder: string
}

export interface PatientDocument {
  id: string
  patientId: string
  name: string
  category: "Intake" | "Assessment" | "Consent" | "Report" | "Other"
  date: string
  size: string
}

export interface QuickNote {
  id: string
  patientId: string
  date: string
  text: string
}

export interface Reminder {
  id: string
  patientId: string
  patientName: string
  text: string
  due: string
  priority: "high" | "medium" | "low"
}

export function moodLabel(mood: Mood): { label: string; className: string } {
  switch (mood) {
    case "positive":
      return { label: "Positive", className: "bg-success/15 text-success" }
    case "neutral":
      return { label: "Neutral", className: "bg-primary/10 text-primary" }
    case "anxious":
      return { label: "Anxious", className: "bg-warning/20 text-warning" }
    case "low":
      return { label: "Low", className: "bg-muted text-muted-foreground" }
    case "distressed":
      return { label: "Distressed", className: "bg-destructive/10 text-destructive" }
  }
}

export function riskLabel(risk: RiskLevel): { label: string; className: string } {
  switch (risk) {
    case "low":
      return { label: "Low risk", className: "bg-success/15 text-success" }
    case "moderate":
      return { label: "Moderate risk", className: "bg-warning/20 text-warning" }
    case "high":
      return { label: "High risk", className: "bg-destructive/10 text-destructive" }
  }
}

export function statusBadge(status: SessionStatus | PatientStatus): {
  label: string
  variant: "default" | "secondary" | "outline" | "destructive"
} {
  switch (status) {
    case "completed":
      return { label: "Completed", variant: "secondary" }
    case "scheduled":
      return { label: "Scheduled", variant: "default" }
    case "cancelled":
      return { label: "Cancelled", variant: "outline" }
    case "missed":
      return { label: "Missed", variant: "destructive" }
    case "active":
      return { label: "Active", variant: "default" }
    case "finished":
      return { label: "Finished", variant: "secondary" }
    case "archived":
      return { label: "Archived", variant: "outline" }
    default:
      return { label: status, variant: "outline" }
  }
}
