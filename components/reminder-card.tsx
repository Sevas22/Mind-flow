"use client"

import {
  SparklesIcon,
  MessageSquareTextIcon,
  TrophyIcon,
  BookOpenCheckIcon,
  PinIcon,
} from "lucide-react"

import { type LastSessionSummary } from "@/lib/types"
import { formatDate } from "@/lib/format"
import { useTranslation } from "@/hooks/use-translation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function Section({
  icon: Icon,
  title,
  items,
  accent,
}: {
  icon: typeof SparklesIcon
  title: string
  items: string[]
  accent?: boolean
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Icon
          className={
            accent ? "size-4 text-primary" : "size-4 text-muted-foreground"
          }
        />
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </span>
      </div>
      <ul className="flex flex-col gap-1.5">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex gap-2 text-sm leading-relaxed text-foreground/90"
          >
            <span
              className={`mt-2 size-1.5 shrink-0 rounded-full ${accent ? "bg-primary" : "bg-muted-foreground/50"}`}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ReminderCard({
  summary,
  lastSessionDate,
}: {
  summary: LastSessionSummary
  lastSessionDate: string
}) {
  const { t } = useTranslation()
  return (
    <Card className="gap-0 overflow-hidden border-primary/25 bg-primary/[0.04] py-0">
      <CardHeader className="flex flex-row items-center justify-between gap-2 border-b border-primary/15 bg-primary/[0.06] px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <SparklesIcon className="size-4.5" />
          </span>
          <div className="flex flex-col">
            <span className="font-semibold">{t.reminderCard.title}</span>
            <span className="text-xs text-muted-foreground">
              {t.reminderCard.subtitle}
            </span>
          </div>
        </div>
        <Badge variant="outline" className="hidden sm:flex">
          {formatDate(lastSessionDate)}
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-6 p-5 md:grid-cols-2">
        <Section
          icon={MessageSquareTextIcon}
          title={t.reminderCard.topicsDiscussed}
          items={summary.topics}
        />
        <Section
          icon={TrophyIcon}
          title={t.reminderCard.achievements}
          items={summary.achievements}
        />
        <Section
          icon={BookOpenCheckIcon}
          title={t.reminderCard.homeworkAssigned}
          items={summary.homework}
        />
        <Section
          icon={PinIcon}
          title={t.reminderCard.rememberNext}
          items={summary.remember}
          accent
        />
      </CardContent>
    </Card>
  )
}
