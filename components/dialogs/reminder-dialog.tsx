"use client"

import * as React from "react"
import { useActionState } from "react"
import { toast } from "sonner"

import { useTranslation } from "@/hooks/use-translation"
import { createReminder, updateReminder } from "@/actions/reminders"
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ReminderData {
  id: string
  text: string
  due: string
  priority: "high" | "medium" | "low"
}

export function ReminderDialog({
  patientId,
  patientName,
  reminder,
  open,
  onOpenChange,
}: {
  patientId: string
  patientName: string
  reminder?: ReminderData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation()
  const isEdit = !!reminder
  const boundAction = isEdit
    ? updateReminder.bind(null, reminder.id)
    : createReminder.bind(null, patientId)
  const [state, formAction, isPending] = useActionState(boundAction, initialFormState)

  React.useEffect(() => {
    if (state.success) {
      onOpenChange(false)
      toast.success(isEdit ? t.reminders.updateToast : t.reminders.createToast)
    }
  }, [state])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? t.reminders.editTitle : t.reminders.createTitle}</DialogTitle>
          <DialogDescription>
            {t.reminders.descriptionPrefix} {patientName}.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <FieldGroup>
            {state.error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {state.error}
              </p>
            )}
            <Field>
              <FieldLabel htmlFor="rem-text">{t.reminders.text}</FieldLabel>
              <Textarea
                id="rem-text"
                name="text"
                defaultValue={reminder?.text}
                placeholder={t.reminders.textPlaceholder}
                rows={2}
                required
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="rem-due">{t.reminders.due}</FieldLabel>
                <Input
                  id="rem-due"
                  name="due"
                  type="date"
                  defaultValue={reminder?.due ?? new Date().toISOString().slice(0, 10)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel>{t.reminders.priority}</FieldLabel>
                <Select name="priority" defaultValue={reminder?.priority ?? "medium"}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="high">{t.reminders.priorityHigh}</SelectItem>
                      <SelectItem value="medium">{t.reminders.priorityMedium}</SelectItem>
                      <SelectItem value="low">{t.reminders.priorityLow}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </FieldGroup>
          <DialogFooter className="mt-6">
            <DialogClose render={<Button variant="outline" type="button" />}>
              {t.dialogs.cancel}
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isEdit ? t.reminders.saveSubmit : t.reminders.createSubmit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
