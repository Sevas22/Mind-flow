import type { PatientDocument } from "@/lib/generated/prisma/client"
import { toDateStr } from "@/lib/serializers/format-helpers"

function formatSize(bytes: number | null): string {
  if (!bytes) return "—"
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${Math.round(kb)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

export function serializeDocument(d: PatientDocument) {
  return {
    id: d.id,
    patientId: d.patientId,
    name: d.name,
    category: d.category,
    date: toDateStr(d.uploadedAt),
    size: formatSize(d.sizeBytes),
  }
}

export type SerializedDocument = ReturnType<typeof serializeDocument>
