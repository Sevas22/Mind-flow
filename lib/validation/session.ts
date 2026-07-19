import { z } from "zod"

function linesToArray(value: string | undefined): string[] {
  if (!value) return []
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
}

export const createSessionSchema = z.object({
  patientId: z.string().min(1, "Choose a patient"),
  date: z.string().min(1, "Choose a date"),
  time: z.string().trim().optional().default("09:00"),
  duration: z.coerce.number().int().min(10).max(240).default(50),
  mood: z.enum(["positive", "neutral", "anxious", "low", "distressed"]),
  reason: z.string().trim().min(2, "Enter a reason for consultation"),
  topics: z.string().optional().transform(linesToArray),
  achievements: z.string().optional().transform(linesToArray),
  homework: z.string().optional().transform(linesToArray),
  nextReminder: z.string().trim().optional().default(""),
  risk: z.enum(["low", "moderate", "high"]).default("low"),
})
