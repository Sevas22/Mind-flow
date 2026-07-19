import type React from "react"
import { requireUser } from "@/lib/auth/dal"
import { getPatientSearchIndex } from "@/lib/data/patients"
import { getUpcomingReminders } from "@/lib/data/reminders"
import { serializeReminder } from "@/lib/serializers/reminder"
import { AppSidebar } from "@/components/app-sidebar"
import { AppNavbar } from "@/components/app-navbar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireUser()
  const [patients, reminders] = await Promise.all([
    getPatientSearchIndex(user.id),
    getUpcomingReminders(user.id),
  ])

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <AppNavbar patients={patients} reminders={reminders.map(serializeReminder)} />
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
