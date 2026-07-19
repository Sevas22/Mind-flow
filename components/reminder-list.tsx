"use client"

import * as React from "react"
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react"

import { toggleReminderDone, deleteReminder } from "@/actions/reminders"
import { useTranslation } from "@/hooks/use-translation"
import { formatDate } from "@/lib/format"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ReminderDialog } from "@/components/dialogs/reminder-dialog"

interface ReminderRow {
  id: string
  text: string
  due: string
  priority: "high" | "medium" | "low"
  done: boolean
}

const priorityDot: Record<ReminderRow["priority"], string> = {
  high: "bg-destructive",
  medium: "bg-warning",
  low: "bg-muted-foreground",
}

export function ReminderList({
  patientId,
  patientName,
  reminders,
}: {
  patientId: string
  patientName: string
  reminders: ReminderRow[]
}) {
  const { t } = useTranslation()
  const [optimistic, setOptimistic] = React.useState(reminders)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingReminder, setEditingReminder] = React.useState<ReminderRow | null>(null)

  React.useEffect(() => setOptimistic(reminders), [reminders])

  function handleToggle(id: string, done: boolean) {
    setOptimistic((prev) => prev.map((r) => (r.id === id ? { ...r, done } : r)))
    void toggleReminderDone(id, done)
  }

  function handleDelete(id: string) {
    setOptimistic((prev) => prev.filter((r) => r.id !== id))
    void deleteReminder(id)
  }

  function openCreate() {
    setEditingReminder(null)
    setDialogOpen(true)
  }

  function openEdit(r: ReminderRow) {
    setEditingReminder(r)
    setDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-3">
      {optimistic.length > 0 ? (
        <ul className="flex flex-col gap-1">
          {optimistic.map((r) => (
            <li
              key={r.id}
              className={cn(
                "group flex items-start gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-primary/[0.05]",
                r.done && "opacity-50",
              )}
            >
              <Checkbox
                checked={r.done}
                onCheckedChange={(checked) => handleToggle(r.id, !!checked)}
                className="mt-0.5"
                aria-label={t.reminders.markDoneAria}
              />
              <div className="flex flex-1 flex-col gap-0.5">
                <span className={cn("text-sm leading-relaxed", r.done && "line-through")}>
                  {r.text}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className={cn("size-1.5 shrink-0 rounded-full", priorityDot[r.priority])} />
                  {formatDate(r.due, "short")}
                </span>
              </div>
              <div className="flex shrink-0 gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => openEdit(r)}
                  aria-label={t.reminders.editReminder}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <PencilIcon className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(r.id)}
                  aria-label={t.reminders.deleteReminder}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2Icon className="size-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">{t.reminders.empty}</p>
      )}
      <Button type="button" variant="outline" size="sm" className="w-fit" onClick={openCreate}>
        <PlusIcon data-icon="inline-start" />
        {t.reminders.addReminder}
      </Button>
      <ReminderDialog
        key={editingReminder?.id ?? "create"}
        patientId={patientId}
        patientName={patientName}
        reminder={editingReminder}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
