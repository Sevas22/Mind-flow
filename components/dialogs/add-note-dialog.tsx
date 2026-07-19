"use client"

import * as React from "react"
import { useActionState } from "react"
import { toast } from "sonner"

import { useTranslation } from "@/hooks/use-translation"
import { createNote } from "@/actions/notes"
import { initialFormState } from "@/actions/types"
import { Button } from "@/components/ui/button"
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

export function AddNoteDialog({
  trigger,
  patientId,
  patientName,
}: {
  trigger: React.ReactNode
  patientId: string
  patientName: string
}) {
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)
  const boundAction = React.useMemo(() => createNote.bind(null, patientId), [patientId])
  const [state, formAction, isPending] = useActionState(boundAction, initialFormState)

  React.useEffect(() => {
    if (state.success) {
      setOpen(false)
      toast.success(t.dialogs.anToast, {
        description: `${t.dialogs.anToastDescPrefix} ${patientName} ${t.dialogs.anToastDescSuffix}`,
      })
    }
  }, [state])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t.dialogs.anTitle}</DialogTitle>
          <DialogDescription>
            {t.dialogs.anDescriptionPrefix} {patientName} {t.dialogs.anDescriptionSuffix}
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
              <FieldLabel htmlFor="qn-text">{t.dialogs.anNote}</FieldLabel>
              <Textarea
                id="qn-text"
                name="text"
                placeholder={t.dialogs.anNotePlaceholder}
                rows={4}
                required
              />
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-6">
            <DialogClose render={<Button variant="outline" type="button" />}>
              {t.dialogs.cancel}
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {t.dialogs.anSubmit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
