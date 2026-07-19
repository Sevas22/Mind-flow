"use client"

import { toast } from "sonner"
import { FileTextIcon, DownloadIcon } from "lucide-react"

import { type PatientDocument } from "@/lib/types"
import { formatDate } from "@/lib/format"
import { useTranslation } from "@/hooks/use-translation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function DocumentList({ documents }: { documents: PatientDocument[] }) {
  const { t } = useTranslation()

  const categoryLabel: Record<PatientDocument["category"], string> = {
    Intake: t.dialogs.udCategoryIntake,
    Assessment: t.dialogs.udCategoryAssessment,
    Consent: t.dialogs.udCategoryConsent,
    Report: t.dialogs.udCategoryReport,
    Other: t.dialogs.udCategoryOther,
  }

  return (
    <div className="flex flex-col divide-y divide-border">
      {documents.map((doc) => (
        <div key={doc.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <FileTextIcon className="size-4" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium">{doc.name}</span>
            <span className="text-xs text-muted-foreground">
              {formatDate(doc.date, "short")} · {doc.size}
            </span>
          </div>
          <Badge variant="secondary" className="hidden sm:flex">
            {categoryLabel[doc.category]}
          </Badge>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground/50"
            aria-label={`${t.patientProfile.downloadLabel} ${doc.name} — ${t.patientProfile.downloadNotConfiguredTitle}`}
            onClick={() =>
              toast(t.patientProfile.downloadNotConfiguredTitle, {
                description: t.patientProfile.downloadNotConfiguredDesc,
              })
            }
          >
            <DownloadIcon />
          </Button>
        </div>
      ))}
    </div>
  )
}
