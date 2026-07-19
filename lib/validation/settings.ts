import { z } from "zod"

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  title: z.string().trim().optional().default(""),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  license: z.string().trim().optional().default(""),
})
