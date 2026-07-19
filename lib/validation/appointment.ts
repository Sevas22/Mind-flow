import { z } from "zod"

export const createAppointmentSchema = z.object({
  patientId: z.string().min(1, "Choose a patient"),
  date: z.string().min(1, "Choose a date"),
  time: z.string().min(1, "Choose a time"),
  duration: z.coerce.number().int().min(10).max(240).default(50),
  location: z.string().trim().min(1).default("Office 2B"),
  status: z.enum(["scheduled", "completed", "cancelled"]).default("scheduled"),
  reminder: z.enum(["1h", "1d", "none"]).default("1h"),
  notes: z.string().trim().optional().default(""),
})

export const reminderLeadTimeToEnum: Record<string, "oneHour" | "oneDay" | "none"> = {
  "1h": "oneHour",
  "1d": "oneDay",
  none: "none",
}

export const rescheduleAppointmentSchema = z.object({
  id: z.string().min(1),
  date: z.string().min(1),
  startTime: z.string().min(1),
})
