"use client"

import * as React from "react"
import { useActionState } from "react"
import { toast } from "sonner"

import { useTranslation } from "@/hooks/use-translation"
import { createDocumentMetadata } from "@/actions/documents"
import { initialFormState } from "@/actions/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function UploadDocumentDialog({
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
  const boundAction = React.useMemo(
    () => createDocumentMetadata.bind(null, patientId),
    [patientId],
  )
  const [state, formAction, isPending] = useActionState(boundAction, initialFormState)

  React.useEffect(() => {
    if (state.success) {
      setOpen(false)
      toast.success(t.dialogs.udToast, {
        description: `${t.dialogs.udToastDescPrefix} ${patientName}.`,
      })
    }
  }, [state])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t.dialogs.udTitle}</DialogTitle>
          <DialogDescription>
            {t.dialogs.udDescriptionPrefix} {patientName}.
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
              <FieldLabel htmlFor="doc-file">{t.dialogs.udFile}</FieldLabel>
              <Input id="doc-file" name="file" type="file" required />
              <FieldError errors={state.fieldErrors?.file?.map((message) => ({ message }))} />
            </Field>
            <Field>
              <FieldLabel>{t.dialogs.udCategory}</FieldLabel>
              <Select name="category" defaultValue="Other">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Intake">{t.dialogs.udCategoryIntake}</SelectItem>
                    <SelectItem value="Assessment">{t.dialogs.udCategoryAssessment}</SelectItem>
                    <SelectItem value="Consent">{t.dialogs.udCategoryConsent}</SelectItem>
                    <SelectItem value="Report">{t.dialogs.udCategoryReport}</SelectItem>
                    <SelectItem value="Other">{t.dialogs.udCategoryOther}</SelectItem>
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
              {t.dialogs.udSubmit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
