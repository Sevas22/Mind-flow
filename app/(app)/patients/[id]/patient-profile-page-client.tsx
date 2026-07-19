"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowLeftIcon,
  TargetIcon,
  CheckCircle2Icon,
  CalendarIcon,
  ActivityIcon,
  TriangleAlertIcon,
  ListChecksIcon,
  PinIcon,
  FilePlusIcon,
  UploadIcon,
  NotebookPenIcon,
  FolderIcon,
  MoreVerticalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"

import type {
  Session,
  PatientDocument,
  QuickNote,
  PatientWithSummary,
} from "@/lib/types"
import { statusBadge } from "@/lib/types"
import { formatDate, relativeDay } from "@/lib/format"
import { useTranslation } from "@/hooks/use-translation"
import { ReminderCard } from "@/components/reminder-card"
import { SessionCard } from "@/components/session-card"
import { SessionTimeline } from "@/components/session-timeline"
import { DocumentList } from "@/components/document-list"
import { HomeworkChecklist } from "@/components/homework-checklist"
import { ReminderList } from "@/components/reminder-list"
import { NewSessionDialog } from "@/components/dialogs/new-session-dialog"
import { AddNoteDialog } from "@/components/dialogs/add-note-dialog"
import { UploadDocumentDialog } from "@/components/dialogs/upload-document-dialog"
import { EditPatientDialog } from "@/components/dialogs/edit-patient-dialog"
import { DeletePatientDialog } from "@/components/dialogs/delete-patient-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"

function MiniStat({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: typeof CalendarIcon
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg bg-muted/50 p-3">
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  )
}

export function PatientProfilePageClient({
  patient,
  sessions,
  documents,
  notes,
}: {
  patient: PatientWithSummary
  sessions: Session[]
  documents: PatientDocument[]
  notes: QuickNote[]
}) {
  const { t } = useTranslation()
  const status = statusBadge(patient.status)
  const patientOption = [{ id: patient.id, name: patient.name }]
  const [editOpen, setEditOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  const timelineEntries = [
    ...sessions
      .slice()
      .sort((a, b) => a.number - b.number)
      .map((s) => ({
        id: s.id,
        number: s.number,
        date: s.date,
        status: s.status,
        mood: s.mood,
        reason: s.reason,
      })),
    ...(patient.nextAppointment
      ? [
          {
            number: patient.sessionsCompleted + 1,
            date: patient.nextAppointment,
            status: "scheduled" as const,
            upcoming: true,
          },
        ]
      : []),
  ]

  return (
    <>
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit"
          nativeButton={false}
          render={<Link href="/patients" />}
        >
          <ArrowLeftIcon data-icon="inline-start" />
          {t.patientProfile.backToPatients}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="icon-sm" aria-label={t.patientProfile.actionsMenu} />
            }
          >
            <MoreVerticalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
              <PencilIcon />
              {t.patientProfile.editPatient}
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2Icon />
              {t.patientProfile.deletePatient}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <EditPatientDialog patient={patient} open={editOpen} onOpenChange={setEditOpen} />
      <DeletePatientDialog
        patientId={patient.id}
        patientName={patient.name}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />

      <div className="flex flex-col gap-6 rounded-xl bg-card p-6 ring-1 ring-foreground/10 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <Avatar size="lg" className={patient.avatarColor}>
            <AvatarFallback className={patient.avatarColor}>
              {patient.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight">
                {patient.name}
              </h1>
              <Badge variant={status.variant}>{t.status[patient.status]}</Badge>
              {patient.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {patient.age} {t.patientProfile.years} · {patient.reason}
            </p>
            <p className="flex items-start gap-1.5 text-sm text-foreground/80">
              <TargetIcon className="mt-0.5 size-3.5 shrink-0 text-primary" />
              {patient.treatmentGoal}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:w-[420px] lg:shrink-0">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{t.patientProfile.treatmentProgress}</span>
            <span className="font-medium tabular-nums">
              {patient.progress}%
            </span>
          </div>
          <Progress value={patient.progress} />
          <div className="grid grid-cols-3 gap-2">
            <MiniStat
              label={t.patientProfile.statSessions}
              value={`${patient.sessionsCompleted}/${patient.totalSessions}`}
              icon={ActivityIcon}
            />
            <MiniStat
              label={t.patientProfile.statLastSession}
              value={patient.lastSession ? formatDate(patient.lastSession, "short") : "—"}
              icon={CalendarIcon}
            />
            <MiniStat
              label={t.patientProfile.statNext}
              value={
                patient.nextAppointment
                  ? relativeDay(patient.nextAppointment)
                  : t.patientProfile.statNone
              }
              icon={CalendarIcon}
            />
          </div>
        </div>
      </div>

      <ReminderCard
        summary={patient.lastSummary}
        lastSessionDate={patient.lastSession ?? patient.startedAt}
      />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">{t.patientProfile.tabOverview}</TabsTrigger>
          <TabsTrigger value="sessions">{t.patientProfile.tabSessions}</TabsTrigger>
          <TabsTrigger value="timeline">{t.patientProfile.tabTimeline}</TabsTrigger>
          <TabsTrigger value="documents">{t.patientProfile.tabDocuments}</TabsTrigger>
          <TabsTrigger value="notes">{t.patientProfile.tabNotes}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t.patientProfile.quickSummaryTitle}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 text-sm text-foreground/80">
                <p>
                  {patient.name} {t.patientProfile.startedTreatmentOn}{" "}
                  {formatDate(patient.startedAt)}
                  {" — "}
                  <span className="font-medium text-foreground">
                    {patient.reason.toLowerCase()}
                  </span>
                  . {t.patientProfile.currentlyPrefix} {patient.sessionsCompleted}/
                  {patient.totalSessions} {t.patientProfile.ofPlannedSessionsComplete}
                </p>
                <p>
                  {t.patientProfile.treatmentGoalLabel}{" "}
                  <span className="italic">{patient.treatmentGoal}</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.patientProfile.recentProgressTitle}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{t.patientProfile.overallProgress}</span>
                  <span className="font-medium tabular-nums">
                    {patient.progress}%
                  </span>
                </div>
                <Progress value={patient.progress} />
                <p className="text-sm text-muted-foreground">
                  {patient.sessionsCompleted} {t.patientProfile.sessionsCompletedSince}{" "}
                  {formatDate(patient.startedAt, "short")}.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <TriangleAlertIcon className="size-4 text-warning" />
                <CardTitle>{t.patientProfile.importantAlertsTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                {patient.alerts.length > 0 ? (
                  <ul className="flex flex-col gap-2">
                    {patient.alerts.map((a, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 rounded-lg bg-warning/10 px-3 py-2 text-sm text-foreground"
                      >
                        <TriangleAlertIcon className="mt-0.5 size-3.5 shrink-0 text-warning" />
                        {a}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2Icon className="size-4 text-success" />
                    {t.patientProfile.noActiveAlerts}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <ListChecksIcon className="size-4 text-primary" />
                <CardTitle>{t.patientProfile.currentHomeworkTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <HomeworkChecklist patientId={patient.id} items={patient.currentHomework} />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-primary/25 bg-primary/[0.04]">
              <CardHeader className="flex flex-row items-center gap-2">
                <PinIcon className="size-4 text-primary" />
                <CardTitle>{t.patientProfile.therapistReminderTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <ReminderList
                  patientId={patient.id}
                  patientName={patient.name}
                  reminders={patient.reminders}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="mt-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {sessions.length} {t.patientProfile.sessionsRecorded}
                {patient.nextAppointment
                  ? ` · ${t.patientProfile.nextOn} ${formatDate(patient.nextAppointment, "short")}`
                  : ""}
              </p>
              <NewSessionDialog
                patientId={patient.id}
                patients={patientOption}
                trigger={
                  <Button size="sm">
                    <FilePlusIcon data-icon="inline-start" />
                    {t.patientProfile.newSession}
                  </Button>
                }
              />
            </div>
            {sessions.length > 0 ? (
              sessions.map((s) => <SessionCard key={s.id} session={s} />)
            ) : (
              <Empty className="border">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FilePlusIcon />
                  </EmptyMedia>
                  <EmptyTitle>{t.patientProfile.noSessionsTitle}</EmptyTitle>
                  <EmptyDescription>
                    {t.patientProfile.noSessionsDescPrefix} {patient.name}.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="mt-4">
          <Card>
            <CardContent className="pt-2">
              <SessionTimeline entries={timelineEntries} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t.patientProfile.documentsTitle}</CardTitle>
              <UploadDocumentDialog
                patientId={patient.id}
                patientName={patient.name}
                trigger={
                  <Button size="sm" variant="outline">
                    <UploadIcon data-icon="inline-start" />
                    {t.patientProfile.upload}
                  </Button>
                }
              />
            </CardHeader>
            <CardContent>
              {documents.length > 0 ? (
                <DocumentList documents={documents} />
              ) : (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <FolderIcon />
                    </EmptyMedia>
                    <EmptyTitle>{t.patientProfile.noDocsTitle}</EmptyTitle>
                    <EmptyDescription>
                      {t.patientProfile.noDocsDescPrefix} {patient.name}.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {t.patientProfile.notesSubtitle}
              </p>
              <AddNoteDialog
                patientId={patient.id}
                patientName={patient.name}
                trigger={
                  <Button size="sm">
                    <NotebookPenIcon data-icon="inline-start" />
                    {t.patientProfile.addNote}
                  </Button>
                }
              />
            </div>
            {notes.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {notes.map((n) => (
                  <Card key={n.id} className="gap-0 py-0">
                    <CardContent className="flex flex-col gap-1.5 p-4">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(n.date)}
                      </span>
                      <p className="text-sm leading-relaxed">{n.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Empty className="border">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <NotebookPenIcon />
                  </EmptyMedia>
                  <EmptyTitle>{t.patientProfile.noNotesTitle}</EmptyTitle>
                  <EmptyDescription>{t.patientProfile.noNotesDesc}</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}
