"use client"

import * as React from "react"
import { UserPlusIcon, UsersIcon } from "lucide-react"

import type { Patient, PatientStatus } from "@/lib/types"
import { useTranslation } from "@/hooks/use-translation"
import { PageHeader } from "@/components/page-header"
import { PatientCard } from "@/components/patient-card"
import { SearchBar } from "@/components/search-bar"
import { NewPatientDialog } from "@/components/dialogs/new-patient-dialog"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty"

export function PatientsPageClient({ patients }: { patients: Patient[] }) {
  const { t } = useTranslation()
  const [query, setQuery] = React.useState("")
  const [status, setStatus] = React.useState<PatientStatus | "all">("all")

  const statusFilters: { label: string; value: PatientStatus | "all" }[] = [
    { label: t.patients.filterAll, value: "all" },
    { label: t.patients.filterActive, value: "active" },
    { label: t.patients.filterFinished, value: "finished" },
    { label: t.patients.filterArchived, value: "archived" },
  ]

  const filtered = patients.filter((p) => {
    const matchesStatus = status === "all" || p.status === status
    const matchesQuery =
      !query ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.reason.toLowerCase().includes(query.toLowerCase())
    return matchesStatus && matchesQuery
  })

  return (
    <>
      <PageHeader
        title={t.patients.title}
        description={`${patients.length} ${t.patients.subtitlePrefix}`}
      >
        <NewPatientDialog
          trigger={
            <Button size="sm">
              <UserPlusIcon data-icon="inline-start" />
              {t.patients.newPatient}
            </Button>
          }
        />
      </PageHeader>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder={t.patients.searchPlaceholder}
          className="sm:max-w-sm"
        />
        <ToggleGroup
          value={[status]}
          onValueChange={(v: string[]) =>
            setStatus((v[0] as PatientStatus | "all") ?? "all")
          }
          variant="outline"
          size="sm"
        >
          {statusFilters.map((f) => (
            <ToggleGroupItem key={f.value} value={f.value}>
              {f.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <PatientCard key={p.id} patient={p} />
          ))}
        </div>
      ) : (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UsersIcon />
            </EmptyMedia>
            <EmptyTitle>{t.patients.noResultsTitle}</EmptyTitle>
            <EmptyDescription>{t.patients.noResultsDesc}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <NewPatientDialog
              trigger={
                <Button size="sm">
                  <UserPlusIcon data-icon="inline-start" />
                  {t.patients.newPatient}
                </Button>
              }
            />
          </EmptyContent>
        </Empty>
      )}
    </>
  )
}
