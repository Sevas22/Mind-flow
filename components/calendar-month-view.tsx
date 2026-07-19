"use client"

import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns"

import { type Appointment } from "@/lib/types"
import { cn } from "@/lib/utils"

const statusDot: Record<Appointment["status"], string> = {
  completed: "bg-success",
  scheduled: "bg-primary",
  cancelled: "bg-muted-foreground/40",
  missed: "bg-destructive",
}

export function CalendarMonthView({
  monthDate,
  appointments,
  selectedDate,
  onSelectDate,
}: {
  monthDate: Date
  appointments: Appointment[]
  selectedDate: string
  onSelectDate: (date: string) => void
}) {
  const start = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 1 })
  const end = endOfWeek(endOfMonth(monthDate), { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start, end })

  return (
    <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
      <div className="grid grid-cols-7 border-b border-border">
        {days.slice(0, 7).map((d) => (
          <div
            key={d.toISOString()}
            className="border-l border-border py-2 text-center text-xs font-medium text-muted-foreground first:border-l-0"
          >
            {format(d, "EEE")}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day, i) => {
          const dayIso = format(day, "yyyy-MM-dd")
          const dayAppointments = appointments.filter((a) => a.date === dayIso)
          const inMonth = isSameMonth(day, monthDate)
          const selected = dayIso === selectedDate
          return (
            <button
              key={dayIso}
              type="button"
              onClick={() => onSelectDate(dayIso)}
              className={cn(
                "flex min-h-24 flex-col gap-1.5 border-l border-t border-border p-2 text-left transition-colors first:border-l-0 hover:bg-muted/50",
                i < 7 && "border-t-0",
                !inMonth && "bg-muted/20 text-muted-foreground",
                selected && "bg-primary/[0.06] ring-1 ring-inset ring-primary/40",
              )}
            >
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-xs font-medium",
                  isToday(day) && "bg-primary text-primary-foreground",
                )}
              >
                {format(day, "d")}
              </span>
              <div className="flex flex-wrap gap-1">
                {dayAppointments.slice(0, 3).map((a) => (
                  <span
                    key={a.id}
                    className={cn("size-1.5 rounded-full", statusDot[a.status])}
                  />
                ))}
                {dayAppointments.length > 3 && (
                  <span className="text-[10px] text-muted-foreground">
                    +{dayAppointments.length - 3}
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
