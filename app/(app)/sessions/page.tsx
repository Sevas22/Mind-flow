import { requireUser } from "@/lib/auth/dal"
import { getSessions } from "@/lib/data/sessions"
import { getActivePatientOptions } from "@/lib/data/patients"
import { serializeSession } from "@/lib/serializers/session"
import { SessionsPageClient } from "@/app/(app)/sessions/sessions-page-client"

export default async function SessionsPage() {
  const user = await requireUser()
  const [sessions, patientOptions] = await Promise.all([
    getSessions(user.id),
    getActivePatientOptions(user.id),
  ])

  return (
    <SessionsPageClient
      sessions={sessions.map(serializeSession)}
      patientOptions={patientOptions}
    />
  )
}
