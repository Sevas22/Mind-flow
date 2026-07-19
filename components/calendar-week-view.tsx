"use client"

import * as React from "react"
import { addDays, format, isToday } from "date-fns"

import { type Appointment } from "@/lib/types"
import { cn } from "@/lib/utils"

const HOUR_START = 8
const HOUR_END = 19
const HOUR_HEIGHT = 64

const statusBlock: Record<Appointment["status"], string> = {
  completed: "border-success bg-success/10",
  scheduled: "border-primary bg-primary/10",
  cancelled: "border-muted-foreground/40 bg-muted opacity-70",
  missed: "border-destructive bg-destructive/10",
}

function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + m
}

function minutesToTime(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
}

export function CalendarWeekView({
  weekStart,
  appointments,
  onAppointmentClick,
  onMove,
  onSlotClick,
}: {
  weekStart: Date
  appointments: Appointment[]
  onAppointmentClick: (appointment: Appointment) => void
  onMove: (id: string, date: string, startTime: string) => void
  onSlotClick: (date: string) => void
}) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const hours = Array.from(
    { length: HOUR_END - HOUR_START },
    (_, i) => HOUR_START + i,
  )
  const totalHeight = (HOUR_END - HOUR_START) * HOUR_HEIGHT

  function handleDrop(e: React.DragEvent<HTMLDivElement>, dayIso: string) {
    e.preventDefault()
    const id = e.dataTransfer.getData("text/plain")
    if (!id) return
    const rect = e.currentTarget.getBoundingClientRect()
    const offsetY = Math.max(0, e.clientY - rect.top)
    const rawMinutes = (offsetY / HOUR_HEIGHT) * 60
    const snapped = Math.round(rawMinutes / 30) * 30
    const startMinutes = HOUR_START * 60 + snapped
    onMove(id, dayIso, minutesToTime(startMinutes))
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-card ring-1 ring-foreground/10">
      <div className="grid min-w-[720px] grid-cols-[56px_repeat(7,1fr)] border-b border-border">
        <div />
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className="flex flex-col items-center gap-0.5 border-l border-border py-2.5"
          >
            <span className="text-xs text-muted-foreground">
              {format(day, "EEE")}
            </span>
            <span
              className={cn(
                "flex size-7 items-center justify-center rounded-full text-sm font-medium",
                isToday(day) && "bg-primary text-primary-foreground",
              )}
            >
              {format(day, "d")}
            </span>
          </div>
        ))}
      </div>

      <div className="grid min-w-[720px] grid-cols-[56px_repeat(7,1fr)]">
        <div className="relative" style={{ height: totalHeight }}>
          {hours.map((h) => (
            <div
              key={h}
              className="absolute right-2 -translate-y-2 text-xs text-muted-foreground"
              style={{ top: (h - HOUR_START) * HOUR_HEIGHT }}
            >
              {format(new Date(2026, 0, 1, h), "h a")}
            </div>
          ))}
        </div>

        {days.map((day) => {
          const dayIso = format(day, "yyyy-MM-dd")
          const dayAppointments = appointments.filter((a) => a.date === dayIso)
          return (
            <div
              key={dayIso}
              className="relative border-l border-border"
              style={{ height: totalHeight }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, dayIso)}
              onClick={(e) => {
                if (e.target === e.currentTarget) onSlotClick(dayIso)
              }}
            >
              {hours.map((h) => (
                <div
                  key={h}
                  className="absolute inset-x-0 border-t border-border/60"
                  style={{ top: (h - HOUR_START) * HOUR_HEIGHT }}
                />
              ))}
              {dayAppointments.map((a) => {
                const start = timeToMinutes(a.startTime)
                const top = ((start - HOUR_START * 60) / 60) * HOUR_HEIGHT
                const height = Math.max(
                  (a.duration / 60) * HOUR_HEIGHT - 4,
                  22,
                )
                return (
                  <div
                    key={a.id}
                    draggable={a.status === "scheduled"}
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", a.id)
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onAppointmentClick(a)
                    }}
                    className={cn(
                      "absolute inset-x-1 flex cursor-pointer flex-col overflow-hidden rounded-md border-l-4 px-2 py-1 text-left transition-shadow hover:shadow-sm",
                      statusBlock[a.status],
                      a.status === "scheduled" && "cursor-grab active:cursor-grabbing",
                    )}
                    style={{ top, height }}
                  >
                    <span className="truncate text-xs font-semibold text-foreground">
                      {a.patientName}
                    </span>
                    <span className="truncate text-[11px] text-muted-foreground">
                      {a.startTime} · {a.location}
                    </span>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
