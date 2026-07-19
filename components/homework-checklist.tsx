"use client"

import * as React from "react"
import { useActionState } from "react"
import { CheckCircle2Icon, CircleIcon, PlusIcon, XIcon } from "lucide-react"

import { toggleHomeworkItem, createHomeworkItem, deleteHomeworkItem } from "@/actions/patients"
import { initialFormState } from "@/actions/types"
import { useTranslation } from "@/hooks/use-translation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface HomeworkItem {
  id: string
  task: string
  done: boolean
}

export function HomeworkChecklist({
  patientId,
  items,
}: {
  patientId: string
  items: HomeworkItem[]
}) {
  const { t } = useTranslation()
  const [optimistic, setOptimistic] = React.useState(items)
  const boundCreate = React.useMemo(
    () => createHomeworkItem.bind(null, patientId),
    [patientId],
  )
  const [state, formAction] = useActionState(boundCreate, initialFormState)
  const formRef = React.useRef<HTMLFormElement>(null)

  React.useEffect(() => setOptimistic(items), [items])

  React.useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
    }
  }, [state])

  function handleToggle(id: string, done: boolean) {
    setOptimistic((prev) => prev.map((h) => (h.id === id ? { ...h, done } : h)))
    void toggleHomeworkItem(id, done)
  }

  function handleDelete(id: string) {
    setOptimistic((prev) => prev.filter((h) => h.id !== id))
    void deleteHomeworkItem(id)
  }

  return (
    <div className="flex flex-col gap-3">
      {optimistic.length > 0 && (
        <ul className="flex flex-col gap-2">
          {optimistic.map((h) => (
            <li key={h.id} className="group flex items-center gap-2 text-sm">
              <button
                type="button"
                onClick={() => handleToggle(h.id, !h.done)}
                className="flex flex-1 items-center gap-2 text-left"
              >
                {h.done ? (
                  <CheckCircle2Icon className="size-4 shrink-0 text-success" />
                ) : (
                  <CircleIcon className="size-4 shrink-0 text-muted-foreground" />
                )}
                <span className={h.done ? "text-muted-foreground line-through" : "text-foreground"}>
                  {h.task}
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(h.id)}
                aria-label={t.patientProfile.deleteHomeworkAria}
                className="shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
              >
                <XIcon className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <form ref={formRef} action={formAction} className="flex items-center gap-2">
        <Input
          name="task"
          placeholder={t.patientProfile.addHomeworkPlaceholder}
          className="h-8 text-sm"
        />
        <Button type="submit" size="icon-sm" variant="outline" aria-label={t.common.add}>
          <PlusIcon />
        </Button>
      </form>
    </div>
  )
}
