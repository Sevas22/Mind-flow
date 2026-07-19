"use client"

import * as React from "react"
import { FilePlusIcon, NotebookPenIcon } from "lucide-react"

import type { Session, SessionStatus } from "@/lib/types"
import { useTranslation } from "@/hooks/use-translation"
import { PageHeader } from "@/components/page-header"
import { SessionCard } from "@/components/session-card"
import { SearchBar } from "@/components/search-bar"
import { NewSessionDialog } from "@/components/dialogs/new-session-dialog"
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

export function SessionsPageClient({
  sessions,
  patientOptions,
}: {
  sessions: Session[]
  patientOptions: { id: string; name: string }[]
}) {
  const { t } = useTranslation()
  const [query, setQuery] = React.useState("")
  const [status, setStatus] = React.useState<SessionStatus | "all">("all")

  const statusFilters: { label: string; value: SessionStatus | "all" }[] = [
    { label: t.sessions.filterAll, value: "all" },
    { label: t.sessions.filterCompleted, value: "completed" },
    { label: t.sessions.filterScheduled, value: "scheduled" },
    { label: t.sessions.filterCancelled, value: "cancelled" },
    { label: t.sessions.filterMissed, value: "missed" },
  ]

  const filtered = sessions
    .filter((s) => {
      const matchesStatus = status === "all" || s.status === status
      const matchesQuery =
        !query ||
        s.patientName.toLowerCase().includes(query.toLowerCase()) ||
        s.reason.toLowerCase().includes(query.toLowerCase())
      return matchesStatus && matchesQuery
    })
    .sort((a, b) => b.date.localeCompare(a.date))

  return (
    <>
      <PageHeader
        title={t.sessions.title}
        description={`${sessions.length} ${t.sessions.subtitlePrefix}`}
      >
        <NewSessionDialog
          patients={patientOptions}
          trigger={
            <Button size="sm">
              <FilePlusIcon data-icon="inline-start" />
              {t.sessions.newSession}
            </Button>
          }
        />
      </PageHeader>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder={t.sessions.searchPlaceholder}
          className="sm:max-w-sm"
        />
        <ToggleGroup
          value={[status]}
          onValueChange={(v: string[]) =>
            setStatus((v[0] as SessionStatus | "all") ?? "all")
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
        <div className="flex flex-col gap-2.5">
          {filtered.map((s) => (
            <SessionCard key={s.id} session={s} showPatient />
          ))}
        </div>
      ) : (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <NotebookPenIcon />
            </EmptyMedia>
            <EmptyTitle>{t.sessions.noResultsTitle}</EmptyTitle>
            <EmptyDescription>{t.sessions.noResultsDesc}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <NewSessionDialog
              patients={patientOptions}
              trigger={
                <Button size="sm">
                  <FilePlusIcon data-icon="inline-start" />
                  {t.sessions.newSession}
                </Button>
              }
            />
          </EmptyContent>
        </Empty>
      )}
    </>
  )
}
