"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { addDays, addMonths, format, parseISO, startOfWeek, subMonths } from "date-fns"
import { CalendarPlusIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import type { Appointment } from "@/lib/types"
import { rescheduleAppointment } from "@/actions/appointments"
import { useTranslation } from "@/hooks/use-translation"
import { PageHeader } from "@/components/page-header"
import { CalendarWeekView } from "@/components/calendar-week-view"
import { CalendarMonthView } from "@/components/calendar-month-view"
import { AppointmentCard } from "@/components/appointment-card"
import { AppointmentActionsMenu } from "@/components/appointment-actions-menu"
import { AppointmentDialog } from "@/components/dialogs/appointment-dialog"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"

const TODAY_ISO = format(new Date(), "yyyy-MM-dd")

export function CalendarPageClient({
  initialAppointments,
  patientOptions,
}: {
  initialAppointments: Appointment[]
  patientOptions: { id: string; name: string }[]
}) {
  const router = useRouter()
  const { t } = useTranslation()

  const legend: { label: string; className: string }[] = [
    { label: t.calendar.legendScheduled, className: "bg-primary" },
    { label: t.calendar.legendCompleted, className: "bg-success" },
    { label: t.calendar.legendCancelled, className: "bg-muted-foreground/40" },
    { label: t.calendar.legendMissed, className: "bg-destructive" },
  ]
  const [appointments, setAppointments] = React.useState<Appointment[]>(initialAppointments)
  const [view, setView] = React.useState<"week" | "month">("week")
  const [currentDate, setCurrentDate] = React.useState(() => parseISO(TODAY_ISO))
  const [selectedDate, setSelectedDate] = React.useState(TODAY_ISO)
  const [slotDialogDate, setSlotDialogDate] = React.useState<string | null>(null)

  React.useEffect(() => setAppointments(initialAppointments), [initialAppointments])

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })

  function goPrev() {
    setCurrentDate((d) => (view === "week" ? addDays(d, -7) : subMonths(d, 1)))
  }
  function goNext() {
    setCurrentDate((d) => (view === "week" ? addDays(d, 7) : addMonths(d, 1)))
  }
  function goToday() {
    setCurrentDate(parseISO(TODAY_ISO))
    setSelectedDate(TODAY_ISO)
  }

  async function handleMove(id: string, date: string, startTime: string) {
    const previous = appointments
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a
        const [sh, sm] = startTime.split(":").map(Number)
        const endMinutes = sh * 60 + sm + a.duration
        const endTime = `${Math.floor(endMinutes / 60)
          .toString()
          .padStart(2, "0")}:${(endMinutes % 60).toString().padStart(2, "0")}`
        return { ...a, date, startTime, endTime }
      }),
    )

    const result = await rescheduleAppointment(id, date, startTime)
    if (!result.ok) {
      setAppointments(previous)
      toast.error(result.error ?? "Could not reschedule.")
      return
    }

    toast.success(t.calendar.movedToastTitle, {
      description: `${format(parseISO(date), "MMM d")} ${t.calendar.movedToastAt} ${startTime}.`,
    })
    router.refresh()
  }

  const selectedDayAppointments = appointments
    .filter((a) => a.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  return (
    <>
      <PageHeader
        title={t.calendar.title}
        description={t.calendar.subtitle}
      >
        <AppointmentDialog
          patients={patientOptions}
          trigger={
            <Button size="sm">
              <CalendarPlusIcon data-icon="inline-start" />
              {t.calendar.newAppointment}
            </Button>
          }
        />
      </PageHeader>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-sm" onClick={goPrev} aria-label="Previous">
            <ChevronLeftIcon />
          </Button>
          <Button variant="outline" size="sm" onClick={goToday}>
            {t.calendar.today}
          </Button>
          <Button variant="outline" size="icon-sm" onClick={goNext} aria-label="Next">
            <ChevronRightIcon />
          </Button>
          <span className="ml-1 text-sm font-medium">
            {view === "week"
              ? `${format(weekStart, "MMM d")} – ${format(addDays(weekStart, 6), "MMM d, yyyy")}`
              : format(currentDate, "MMMM yyyy")}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-3 sm:flex">
            {legend.map((l) => (
              <span
                key={l.label}
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <span className={`size-2 rounded-full ${l.className}`} />
                {l.label}
              </span>
            ))}
          </div>
          <ToggleGroup
            value={[view]}
            onValueChange={(v: string[]) => {
              if (v[0] === "week" || v[0] === "month") setView(v[0])
            }}
            variant="outline"
            size="sm"
          >
            <ToggleGroupItem value="week">{t.calendar.week}</ToggleGroupItem>
            <ToggleGroupItem value="month">{t.calendar.month}</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {view === "week" ? (
        <CalendarWeekView
          weekStart={weekStart}
          appointments={appointments}
          onAppointmentClick={(a) => router.push(`/patients/${a.patientId}`)}
          onMove={handleMove}
          onSlotClick={(date) => setSlotDialogDate(date)}
        />
      ) : (
        <>
          <CalendarMonthView
            monthDate={currentDate}
            appointments={appointments}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">
                {format(parseISO(selectedDate), "EEEE, MMMM d")}
              </h3>
              <AppointmentDialog
                defaultDate={selectedDate}
                patients={patientOptions}
                trigger={
                  <Button size="sm" variant="outline">
                    <CalendarPlusIcon data-icon="inline-start" />
                    {t.calendar.add}
                  </Button>
                }
              />
            </div>
            {selectedDayAppointments.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {selectedDayAppointments.map((a) => (
                  <AppointmentCard
                    key={a.id}
                    appointment={a}
                    actions={<AppointmentActionsMenu appointment={a} />}
                  />
                ))}
              </div>
            ) : (
              <Empty className="border">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <CalendarPlusIcon />
                  </EmptyMedia>
                  <EmptyTitle>{t.calendar.noAppointmentsTitle}</EmptyTitle>
                  <EmptyDescription>{t.calendar.noAppointmentsDesc}</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </div>
        </>
      )}

      <AppointmentDialog
        key={slotDialogDate ?? "closed"}
        defaultDate={slotDialogDate ?? undefined}
        patients={patientOptions}
        open={slotDialogDate !== null}
        onOpenChange={(o) => !o && setSlotDialogDate(null)}
      />
    </>
  )
}
