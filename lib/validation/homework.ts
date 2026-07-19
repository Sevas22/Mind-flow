import { z } from "zod"

export const createHomeworkSchema = z.object({
  task: z.string().trim().min(1, "Write a task"),
})
