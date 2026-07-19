import { format } from "date-fns"

export function toDateStr(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

export function toTimeStr(date: Date): string {
  return format(date, "HH:mm")
}

export function combineDateTime(dateStr: string, timeStr: string): Date {
  const [h, m] = timeStr.split(":").map(Number)
  const [y, mo, d] = dateStr.split("-").map(Number)
  return new Date(y, mo - 1, d, h || 0, m || 0, 0, 0)
}
