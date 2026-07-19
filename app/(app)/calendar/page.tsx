import { requireUser } from "@/lib/auth/dal"
import { getAppointments } from "@/lib/data/appointments"
import { getActivePatientOptions } from "@/lib/data/patients"
import { serializeAppointment } from "@/lib/serializers/appointment"
import { CalendarPageClient } from "@/app/(app)/calendar/calendar-page-client"

export default async function CalendarPage() {
  const user = await requireUser()
  const [appointments, patientOptions] = await Promise.all([
    getAppointments(user.id),
    getActivePatientOptions(user.id),
  ])

  return (
    <CalendarPageClient
      initialAppointments={appointments.map(serializeAppointment)}
      patientOptions={patientOptions}
    />
  )
}
