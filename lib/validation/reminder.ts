import { z } from "zod"

export const reminderSchema = z.object({
  text: z.string().trim().min(1, "Write a reminder"),
  due: z.string().min(1, "Choose a date"),
  priority: z.enum(["high", "medium", "low"]).default("medium"),
})
