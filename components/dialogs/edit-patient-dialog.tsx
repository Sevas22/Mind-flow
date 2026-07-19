"use client"

import * as React from "react"
import { useActionState } from "react"
import { toast } from "sonner"

import type { Patient } from "@/lib/types"
import { useTranslation } from "@/hooks/use-translation"
import { updatePatient } from "@/actions/patients"
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
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function EditPatientDialog({
  patient,
  open,
  onOpenChange,
}: {
  patient: Patient
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation()
  const boundAction = React.useMemo(
    () => updatePatient.bind(null, patient.id),
    [patient.id],
  )
  const [state, formAction, isPending] = useActionState(boundAction, initialFormState)

  React.useEffect(() => {
    if (state.success) {
      onOpenChange(false)
      toast.success(t.dialogs.epToast, {
        description: `${t.dialogs.epToastDescPrefix} ${patient.name} ${t.dialogs.epToastDescSuffix}`,
      })
    }
  }, [state])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.dialogs.epTitle}</DialogTitle>
          <DialogDescription>
            {t.dialogs.epDescriptionPrefix} {patient.name}.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <FieldGroup>
            {state.error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {state.error}
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="ep-name">{t.dialogs.epFullName}</FieldLabel>
                <Input id="ep-name" name="name" defaultValue={patient.name} required />
                <FieldError errors={state.fieldErrors?.name?.map((message) => ({ message }))} />
              </Field>
              <Field>
                <FieldLabel htmlFor="ep-age">{t.dialogs.epAge}</FieldLabel>
                <Input id="ep-age" name="age" type="number" defaultValue={patient.age} required />
                <FieldError errors={state.fieldErrors?.age?.map((message) => ({ message }))} />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="ep-email">{t.dialogs.epEmail}</FieldLabel>
                <Input id="ep-email" name="email" type="email" defaultValue={patient.email} />
              </Field>
              <Field>
                <FieldLabel htmlFor="ep-phone">{t.dialogs.epPhone}</FieldLabel>
                <Input id="ep-phone" name="phone" defaultValue={patient.phone} />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="ep-reason">{t.dialogs.epReason}</FieldLabel>
                <Input id="ep-reason" name="reason" defaultValue={patient.reason} required />
                <FieldError errors={state.fieldErrors?.reason?.map((message) => ({ message }))} />
              </Field>
              <Field>
                <FieldLabel htmlFor="ep-total">{t.dialogs.epTotalSessions}</FieldLabel>
                <Input
                  id="ep-total"
                  name="totalSessions"
                  type="number"
                  min={1}
                  defaultValue={patient.totalSessions}
                  required
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="ep-goal">{t.dialogs.epTreatmentGoal}</FieldLabel>
              <Textarea
                id="ep-goal"
                name="treatmentGoal"
                defaultValue={patient.treatmentGoal}
                rows={2}
              />
            </Field>
            <Field>
              <FieldLabel>{t.dialogs.epStatus}</FieldLabel>
              <Select name="status" defaultValue={patient.status}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="active">{t.status.active}</SelectItem>
                    <SelectItem value="finished">{t.status.finished}</SelectItem>
                    <SelectItem value="archived">{t.status.archived}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-6">
            <DialogClose render={<Button variant="outline" type="button" />}>
              {t.dialogs.cancel}
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {t.dialogs.epSubmit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
