import { requireUser } from "@/lib/auth/dal"
import { SettingsPageClient } from "@/app/(app)/settings/settings-page-client"

export default async function SettingsPage() {
  const user = await requireUser()
  return <SettingsPageClient user={user} />
}
