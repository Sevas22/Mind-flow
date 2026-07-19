"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { MoreVerticalIcon, CheckCircle2Icon, XCircleIcon, FilePlusIcon } from "lucide-react"

import type { Appointment } from "@/lib/types"
import { updateAppointmentStatus } from "@/actions/appointments"
import { useTranslation } from "@/hooks/use-translation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NewSessionDialog } from "@/components/dialogs/new-session-dialog"

export function AppointmentActionsMenu({ appointment }: { appointment: Appointment }) {
  const { t } = useTranslation()
  const router = useRouter()
  const [sessionDialogOpen, setSessionDialogOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  function setStatus(status: "completed" | "missed" | "cancelled") {
    startTransition(async () => {
      const result = await updateAppointmentStatus(appointment.id, status)
      if (result.ok) {
        toast.success(t.calendar.statusUpdatedToast)
        router.refresh()
      }
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon-sm" aria-label={t.calendar.actionsAria} />}
        >
          <MoreVerticalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setSessionDialogOpen(true)}>
            <FilePlusIcon />
            {t.calendar.createSessionNote}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled={isPending} onClick={() => setStatus("completed")}>
            <CheckCircle2Icon />
            {t.calendar.markCompleted}
          </DropdownMenuItem>
          <DropdownMenuItem disabled={isPending} onClick={() => setStatus("missed")}>
            <XCircleIcon />
            {t.calendar.markMissed}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            disabled={isPending}
            onClick={() => setStatus("cancelled")}
          >
            <XCircleIcon />
            {t.calendar.markCancelled}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <NewSessionDialog
        patientId={appointment.patientId}
        patients={[{ id: appointment.patientId, name: appointment.patientName }]}
        defaultDate={appointment.date}
        open={sessionDialogOpen}
        onOpenChange={setSessionDialogOpen}
      />
    </>
  )
}
