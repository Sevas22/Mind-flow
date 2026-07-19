import type { QuickNote } from "@/lib/generated/prisma/client"
import { toDateStr } from "@/lib/serializers/format-helpers"

export function serializeNote(n: QuickNote) {
  return {
    id: n.id,
    patientId: n.patientId,
    date: toDateStr(n.createdAt),
    text: n.text,
  }
}

export type SerializedNote = ReturnType<typeof serializeNote>
