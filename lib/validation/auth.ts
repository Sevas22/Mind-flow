import { z } from "zod"

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Must be at least 8 characters")
    .regex(/[0-9]/, "Must include a number")
    .regex(/[^a-zA-Z0-9]/, "Must include a symbol"),
  title: z.string().trim().optional(),
})

export const logInSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
  remember: z.coerce.boolean().optional(),
})
