import { format, parseISO } from "date-fns"

export function formatDate(
  date: string | Date,
  variant: "short" | "long" | "full" | "day" = "long",
) {
  const d = typeof date === "string" ? parseISO(date) : date
  switch (variant) {
    case "short":
      return format(d, "MMM d")
    case "day":
      return format(d, "EEE, MMM d")
    case "full":
      return format(d, "EEEE, MMMM d, yyyy")
    case "long":
    default:
      return format(d, "MMM d, yyyy")
  }
}

export function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number)
  const period = h >= 12 ? "PM" : "AM"
  const hour = h % 12 === 0 ? 12 : h % 12
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`
}

export function relativeDay(date: string) {
  const target = parseISO(date)
  const today = parseISO("2026-07-14")
  const diff = Math.round(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  )
  if (diff === 0) return "Today"
  if (diff === 1) return "Tomorrow"
  if (diff === -1) return "Yesterday"
  if (diff > 1 && diff < 7) return `In ${diff} days`
  if (diff < 0) return `${Math.abs(diff)} days ago`
  return formatDate(date, "short")
}
