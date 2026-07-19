import { z } from "zod"

export const treatmentApproachTags: Record<string, string[]> = {
  cbt: ["CBT"],
  psychodynamic: ["Psychodynamic"],
  humanistic: ["Humanistic"],
  emdr: ["EMDR"],
}

export const createPatientSchema = z.object({
  name: z.string().trim().min(2, "Enter the patient's full name"),
  age: z.coerce.number().int().min(0).max(120),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email")
    .optional()
    .or(z.literal("")),
  reason: z.string().trim().min(2, "Enter a primary reason"),
  treatmentGoal: z.string().trim().optional().default(""),
  totalSessions: z.coerce.number().int().min(1).max(200).default(12),
  approach: z.enum(["cbt", "psychodynamic", "humanistic", "emdr"]).default("cbt"),
})

export const patientStatusSchema = z.enum(["active", "finished", "archived"])

export const updatePatientSchema = z.object({
  name: z.string().trim().min(2, "Enter the patient's full name"),
  age: z.coerce.number().int().min(0).max(120),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email")
    .optional()
    .or(z.literal("")),
  phone: z.string().trim().optional().default(""),
  reason: z.string().trim().min(2, "Enter a primary reason"),
  treatmentGoal: z.string().trim().optional().default(""),
  totalSessions: z.coerce.number().int().min(1).max(200),
  status: patientStatusSchema,
})
