"use client"

import * as React from "react"
import { useActionState } from "react"
import { toast } from "sonner"

import { useTranslation } from "@/hooks/use-translation"
import { createSession } from "@/actions/sessions"
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

export function NewSessionDialog({
  trigger,
  patientId,
  patients,
  defaultDate,
  open: openProp,
  onOpenChange,
}: {
  trigger?: React.ReactNode
  patientId?: string
  patients: { id: string; name: string }[]
  defaultDate?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const { t } = useTranslation()
  const [openState, setOpenState] = React.useState(false)
  const open = openProp ?? openState
  const setOpen = onOpenChange ?? setOpenState
  const [state, formAction, isPending] = useActionState(createSession, initialFormState)

  React.useEffect(() => {
    if (state.success) {
      setOpen(false)
      toast.success(t.dialogs.nsToast, { description: t.dialogs.nsToastDesc })
    }
  }, [state])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.dialogs.nsTitle}</DialogTitle>
          <DialogDescription>{t.dialogs.nsDescription}</DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <FieldGroup>
            {state.error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {state.error}
              </p>
            )}
            <Field>
              <FieldLabel>{t.dialogs.nsPatient}</FieldLabel>
              <Select name="patientId" defaultValue={patientId ?? patients[0]?.id}>
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
                <FieldLabel htmlFor="ns-date">{t.dialogs.nsDate}</FieldLabel>
                <Input
                  id="ns-date"
                  name="date"
                  type="date"
                  defaultValue={defaultDate ?? new Date().toISOString().slice(0, 10)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel>{t.dialogs.nsMood}</FieldLabel>
                <Select name="mood" defaultValue="neutral">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="positive">{t.mood.positive}</SelectItem>
                      <SelectItem value="neutral">{t.mood.neutral}</SelectItem>
                      <SelectItem value="anxious">{t.mood.anxious}</SelectItem>
                      <SelectItem value="low">{t.mood.low}</SelectItem>
                      <SelectItem value="distressed">{t.mood.distressed}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="ns-reason">{t.dialogs.nsReason}</FieldLabel>
              <Textarea
                id="ns-reason"
                name="reason"
                placeholder={t.dialogs.nsReasonPlaceholder}
                rows={2}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="ns-topics">{t.dialogs.nsTopics}</FieldLabel>
              <Textarea
                id="ns-topics"
                name="topics"
                placeholder={t.dialogs.nsTopicsPlaceholder}
                rows={2}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="ns-achievements">{t.dialogs.nsAchievements}</FieldLabel>
              <Textarea
                id="ns-achievements"
                name="achievements"
                placeholder={t.dialogs.nsAchievementsPlaceholder}
                rows={2}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="ns-homework">{t.dialogs.nsHomework}</FieldLabel>
              <Textarea
                id="ns-homework"
                name="homework"
                placeholder={t.dialogs.nsHomeworkPlaceholder}
                rows={2}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="ns-remember">{t.dialogs.nsNextReminder}</FieldLabel>
                <Textarea
                  id="ns-remember"
                  name="nextReminder"
                  placeholder={t.dialogs.nsNextReminderPlaceholder}
                  rows={2}
                />
              </Field>
              <Field>
                <FieldLabel>{t.dialogs.nsRisk}</FieldLabel>
                <Select name="risk" defaultValue="low">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="low">{t.risk.low}</SelectItem>
                      <SelectItem value="moderate">{t.risk.moderate}</SelectItem>
                      <SelectItem value="high">{t.risk.high}</SelectItem>
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
              {t.dialogs.nsSubmit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
