"use client"

import Link from "next/link"
import {
  ArrowLeftIcon,
  ClockIcon,
  MessageSquareTextIcon,
  TargetIcon,
  MessagesSquareIcon,
  StethoscopeIcon,
  WrenchIcon,
  BookOpenCheckIcon,
  TrophyIcon,
  EyeIcon,
  BellIcon,
  ShieldAlertIcon,
  CalendarClockIcon,
} from "lucide-react"

import type { Session } from "@/lib/types"
import { statusBadge, moodLabel, riskLabel } from "@/lib/types"
import { formatDate } from "@/lib/format"
import { useTranslation } from "@/hooks/use-translation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

function InfoCard({
  icon: Icon,
  title,
  children,
  className,
}: {
  icon: typeof TargetIcon
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center gap-2">
        <Icon className="size-4 text-primary" />
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function ListCard({
  icon,
  title,
  items,
  emptyLabel,
  className,
}: {
  icon: typeof TargetIcon
  title: string
  items: string[]
  emptyLabel: string
  className?: string
}) {
  return (
    <InfoCard icon={icon} title={title} className={className}>
      {items.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm leading-relaxed">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      )}
    </InfoCard>
  )
}

export function SessionDetailPageClient({ session }: { session: Session }) {
  const { t } = useTranslation()
  const status = statusBadge(session.status)
  const mood = moodLabel(session.mood)
  const risk = riskLabel(session.risk)
  const emptyLabel = "—"

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="w-fit"
        nativeButton={false}
        render={<Link href="/sessions" />}
      >
        <ArrowLeftIcon data-icon="inline-start" />
        {t.sessionDetail.backToSessions}
      </Button>

      <div className="flex flex-col gap-4 rounded-xl bg-card p-6 ring-1 ring-foreground/10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight">
              {t.sessionDetail.session} {session.number}
            </h1>
            <Badge variant={status.variant}>{t.status[session.status]}</Badge>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${mood.className}`}
            >
              {t.mood[session.mood]}
            </span>
          </div>
          <Link
            href={`/patients/${session.patientId}`}
            className="w-fit text-sm font-medium text-primary hover:underline"
          >
            {session.patientName}
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarClockIcon className="size-4" />
            {formatDate(session.date, "full")} · {session.time}
          </span>
          <span className="flex items-center gap-1.5">
            <ClockIcon className="size-4" />
            {session.duration} {t.sessions.minutes}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${risk.className}`}
          >
            {t.risk[session.risk]}
          </span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <InfoCard icon={MessageSquareTextIcon} title={t.sessionDetail.reasonForConsultation}>
          <p className="text-sm leading-relaxed text-foreground/90">
            {session.reason}
          </p>
        </InfoCard>

        <ListCard
          icon={TargetIcon}
          title={t.sessionDetail.objectives}
          items={session.objectives}
          emptyLabel={emptyLabel}
        />

        <ListCard
          icon={MessagesSquareIcon}
          title={t.sessionDetail.topicsDiscussed}
          items={session.topics}
          emptyLabel={emptyLabel}
        />

        <ListCard
          icon={TrophyIcon}
          title={t.sessionDetail.achievements}
          items={session.achievements}
          emptyLabel={emptyLabel}
        />

        <ListCard
          icon={StethoscopeIcon}
          title={t.sessionDetail.interventions}
          items={session.interventions}
          emptyLabel={emptyLabel}
        />

        <ListCard
          icon={WrenchIcon}
          title={t.sessionDetail.therapeuticTechniques}
          items={session.techniques}
          emptyLabel={emptyLabel}
        />

        <ListCard
          icon={BookOpenCheckIcon}
          title={t.sessionDetail.homework}
          items={session.homework}
          emptyLabel={emptyLabel}
        />

        <InfoCard icon={EyeIcon} title={t.sessionDetail.observations}>
          <p className="text-sm leading-relaxed text-foreground/90">
            {session.observations || emptyLabel}
          </p>
        </InfoCard>

        <InfoCard icon={BellIcon} title={t.sessionDetail.nextSessionReminder} className="border-primary/25 bg-primary/[0.04]">
          <p className="text-sm leading-relaxed text-foreground/90">
            {session.nextReminder || emptyLabel}
          </p>
        </InfoCard>

        <InfoCard icon={ShieldAlertIcon} title={t.sessionDetail.riskAssessment}>
          <div className="flex flex-col gap-2">
            <span
              className={`w-fit rounded-full px-2.5 py-1 text-sm font-medium ${risk.className}`}
            >
              {t.risk[session.risk]}
            </span>
            <p className="text-sm text-muted-foreground">
              {t.sessionDetail.riskAssessmentNote}
            </p>
          </div>
        </InfoCard>

        <InfoCard icon={ClockIcon} title={t.sessionDetail.followUp}>
          <p className="text-sm leading-relaxed text-foreground/90">
            {session.followUp || emptyLabel}
          </p>
        </InfoCard>
      </div>
    </>
  )
}
