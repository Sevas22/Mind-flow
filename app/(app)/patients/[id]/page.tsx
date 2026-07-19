import { notFound } from "next/navigation"

import { requireUser } from "@/lib/auth/dal"
import { getPatient } from "@/lib/data/patients"
import { getPatientSessions } from "@/lib/data/sessions"
import { getPatientDocuments } from "@/lib/data/documents"
import { getPatientNotes } from "@/lib/data/notes"
import { serializePatientDetail } from "@/lib/serializers/patient"
import { serializeSession } from "@/lib/serializers/session"
import { serializeDocument } from "@/lib/serializers/document"
import { serializeNote } from "@/lib/serializers/note"
import { PatientProfilePageClient } from "@/app/(app)/patients/[id]/patient-profile-page-client"

export default async function PatientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await requireUser()

  const patient = await getPatient(user.id, id)
  if (!patient) notFound()

  const [sessions, documents, notes] = await Promise.all([
    getPatientSessions(user.id, id),
    getPatientDocuments(user.id, id),
    getPatientNotes(user.id, id),
  ])

  return (
    <PatientProfilePageClient
      patient={serializePatientDetail(patient)}
      sessions={sessions.map(serializeSession)}
      documents={documents.map(serializeDocument)}
      notes={notes.map(serializeNote)}
    />
  )
}
