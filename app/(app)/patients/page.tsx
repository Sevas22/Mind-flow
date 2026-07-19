import { requireUser } from "@/lib/auth/dal"
import { getPatients } from "@/lib/data/patients"
import { serializePatientCard } from "@/lib/serializers/patient"
import { PatientsPageClient } from "@/app/(app)/patients/patients-page-client"

export default async function PatientsPage() {
  const user = await requireUser()
  const patients = await getPatients(user.id)

  return <PatientsPageClient patients={patients.map(serializePatientCard)} />
}
