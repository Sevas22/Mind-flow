import { z } from "zod"

export const documentCategorySchema = z
  .enum(["Intake", "Assessment", "Consent", "Report", "Other"])
  .default("Other")
