"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { TriangleAlertIcon } from "lucide-react"

import { useTranslation } from "@/hooks/use-translation"
import { deletePatient } from "@/actions/patients"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function DeletePatientDialog({
  patientId,
  patientName,
  open,
  onOpenChange,
}: {
  patientId: string
  patientName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation()
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  function handleDelete() {
    startTransition(async () => {
      const result = await deletePatient(patientId)
      if (!result.ok) {
        toast.error(t.dialogs.dpError)
        return
      }
      onOpenChange(false)
      toast.success(t.dialogs.dpToast, {
        description: `${t.dialogs.dpToastDescPrefix} ${patientName} ${t.dialogs.dpToastDescSuffix}`,
      })
      router.push("/patients")
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TriangleAlertIcon className="size-4.5 text-destructive" />
            {t.dialogs.dpTitle}
          </DialogTitle>
          <DialogDescription>
            {t.dialogs.dpDescriptionPrefix} {patientName}?
          </DialogDescription>
        </DialogHeader>
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {t.dialogs.dpWarning}
        </p>
        <DialogFooter className="mt-2">
          <DialogClose render={<Button variant="outline" type="button" />}>
            {t.dialogs.cancel}
          </DialogClose>
          <Button variant="destructive" disabled={isPending} onClick={handleDelete}>
            {t.dialogs.dpConfirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
