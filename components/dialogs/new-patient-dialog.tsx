"use client"

import * as React from "react"
import { useActionState } from "react"
import { toast } from "sonner"

import { useTranslation } from "@/hooks/use-translation"
import { createPatient } from "@/actions/patients"
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
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function NewPatientDialog({
  trigger,
}: {
  trigger: React.ReactNode
}) {
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)
  const [state, formAction, isPending] = useActionState(createPatient, initialFormState)

  React.useEffect(() => {
    if (state.success) {
      setOpen(false)
      toast.success(t.dialogs.npToast, { description: t.dialogs.npToastDesc })
    }
  }, [state])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t.dialogs.npTitle}</DialogTitle>
          <DialogDescription>
            {t.dialogs.npDescription}
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
                <FieldLabel htmlFor="np-name">{t.dialogs.npFullName}</FieldLabel>
                <Input id="np-name" name="name" placeholder="Jane Doe" required />
                <FieldError errors={state.fieldErrors?.name?.map((message) => ({ message }))} />
              </Field>
              <Field>
                <FieldLabel htmlFor="np-age">{t.dialogs.npAge}</FieldLabel>
                <Input id="np-age" name="age" type="number" placeholder="32" required />
                <FieldError errors={state.fieldErrors?.age?.map((message) => ({ message }))} />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="np-email">{t.dialogs.npEmail}</FieldLabel>
              <Input id="np-email" name="email" type="email" placeholder="jane@email.com" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="np-reason">{t.dialogs.npReason}</FieldLabel>
                <Input id="np-reason" name="reason" placeholder="e.g. Generalized anxiety" required />
                <FieldError errors={state.fieldErrors?.reason?.map((message) => ({ message }))} />
              </Field>
              <Field>
                <FieldLabel htmlFor="np-total">{t.dialogs.npTotalSessions}</FieldLabel>
                <Input id="np-total" name="totalSessions" type="number" defaultValue={12} min={1} required />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="np-goal">{t.dialogs.npTreatmentGoal}</FieldLabel>
              <Textarea
                id="np-goal"
                name="treatmentGoal"
                placeholder={t.dialogs.npTreatmentGoalPlaceholder}
                rows={2}
              />
            </Field>
            <Field>
              <FieldLabel>{t.dialogs.npApproach}</FieldLabel>
              <Select name="approach" defaultValue="cbt">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="cbt">{t.dialogs.npApproachCbt}</SelectItem>
                    <SelectItem value="psychodynamic">{t.dialogs.npApproachPsychodynamic}</SelectItem>
                    <SelectItem value="humanistic">{t.dialogs.npApproachHumanistic}</SelectItem>
                    <SelectItem value="emdr">{t.dialogs.npApproachEmdr}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldDescription>
                {t.dialogs.npApproachHint}
              </FieldDescription>
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-6">
            <DialogClose render={<Button variant="outline" type="button" />}>
              {t.dialogs.cancel}
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {t.dialogs.npSubmit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
