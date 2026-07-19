"use client"

import { UserPlusIcon, FilePlusIcon, CalendarPlusIcon } from "lucide-react"

import { useTranslation } from "@/hooks/use-translation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NewPatientDialog } from "@/components/dialogs/new-patient-dialog"
import { NewSessionDialog } from "@/components/dialogs/new-session-dialog"
import { AppointmentDialog } from "@/components/dialogs/appointment-dialog"

function ActionButton({
  icon: Icon,
  label,
  hint,
  ...props
}: {
  icon: typeof UserPlusIcon
  label: string
  hint: string
} & React.ComponentProps<"button">) {
  return (
    <button
      {...props}
      className="flex w-full items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-primary/40 hover:bg-muted/50"
    >
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4.5" />
      </span>
      <span className="flex flex-col">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">{hint}</span>
      </span>
    </button>
  )
}

export function QuickActions({
  patients,
}: {
  patients: { id: string; name: string }[]
}) {
  const { t } = useTranslation()
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.dashboard.quickActionsTitle}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2.5">
        <NewPatientDialog
          trigger={
            <ActionButton
              icon={UserPlusIcon}
              label={t.dashboard.newPatient}
              hint={t.dashboard.newPatientHint}
            />
          }
        />
        <NewSessionDialog
          patients={patients}
          trigger={
            <ActionButton
              icon={FilePlusIcon}
              label={t.dashboard.newSession}
              hint={t.dashboard.newSessionHint}
            />
          }
        />
        <AppointmentDialog
          patients={patients}
          trigger={
            <ActionButton
              icon={CalendarPlusIcon}
              label={t.dashboard.scheduleAppointment}
              hint={t.dashboard.scheduleAppointmentHint}
            />
          }
        />
      </CardContent>
    </Card>
  )
}
