"use client"

import * as React from "react"
import { useActionState } from "react"
import { toast } from "sonner"

import { useTranslation } from "@/hooks/use-translation"
import { createAppointment } from "@/actions/appointments"
import { initialFormState } from "@/actions/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function AppointmentDialog({
  trigger,
  defaultDate,
  patients,
  open: openProp,
  onOpenChange,
}: {
  trigger?: React.ReactNode
  defaultDate?: string
  patients: { id: string; name: string }[]
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const { t } = useTranslation()
  const [openState, setOpenState] = React.useState(false)
  const open = openProp ?? openState
  const setOpen = onOpenChange ?? setOpenState
  const [state, formAction, isPending] = useActionState(createAppointment, initialFormState)

  React.useEffect(() => {
    if (state.success) {
      setOpen(false)
      toast.success(t.dialogs.apToast, { description: t.dialogs.apToastDesc })
    }
  }, [state])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t.dialogs.apTitle}</DialogTitle>
          <DialogDescription>{t.dialogs.apDescription}</DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <FieldGroup>
            {state.error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {state.error}
              </p>
            )}
            <Field>
              <FieldLabel>{t.dialogs.apPatient}</FieldLabel>
              <Select name="patientId" defaultValue={patients[0]?.id}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {patients.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="ap-date">{t.dialogs.apDate}</FieldLabel>
                <Input
                  id="ap-date"
                  name="date"
                  type="date"
                  defaultValue={defaultDate ?? new Date().toISOString().slice(0, 10)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="ap-time">{t.dialogs.apTime}</FieldLabel>
                <Input id="ap-time" name="time" type="time" defaultValue="10:00" required />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>{t.dialogs.apDuration}</FieldLabel>
                <Select name="duration" defaultValue="50">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="30">30 {t.common.minutes}</SelectItem>
                      <SelectItem value="50">50 {t.common.minutes}</SelectItem>
                      <SelectItem value="60">60 {t.common.minutes}</SelectItem>
                      <SelectItem value="90">90 {t.common.minutes}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>{t.dialogs.apLocation}</FieldLabel>
                <Select name="location" defaultValue="Office 2B">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Office 2B">{t.dialogs.apLocationOffice2b}</SelectItem>
                      <SelectItem value="Office 1A">{t.dialogs.apLocationOffice1a}</SelectItem>
                      <SelectItem value="Telehealth">{t.dialogs.apLocationTelehealth}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>{t.dialogs.apStatus}</FieldLabel>
                <Select name="status" defaultValue="scheduled">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="scheduled">{t.dialogs.apStatusScheduled}</SelectItem>
                      <SelectItem value="completed">{t.dialogs.apStatusCompleted}</SelectItem>
                      <SelectItem value="cancelled">{t.dialogs.apStatusCancelled}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>{t.dialogs.apReminder}</FieldLabel>
                <Select name="reminder" defaultValue="1h">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="1h">{t.dialogs.apReminder1h}</SelectItem>
                      <SelectItem value="1d">{t.dialogs.apReminder1d}</SelectItem>
                      <SelectItem value="none">{t.dialogs.apReminderNone}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="ap-notes">{t.dialogs.apNotes}</FieldLabel>
              <Textarea
                id="ap-notes"
                name="notes"
                placeholder={t.dialogs.apNotesPlaceholder}
                rows={3}
              />
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-6">
            <DialogClose render={<Button variant="outline" type="button" />}>
              {t.dialogs.cancel}
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {t.dialogs.apSubmit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
