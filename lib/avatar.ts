export const avatarColors = [
  "bg-primary/15 text-primary",
  "bg-accent/15 text-accent",
  "bg-success/15 text-success",
  "bg-warning/20 text-warning",
  "bg-chart-5/15 text-chart-5",
  "bg-destructive/10 text-destructive",
]

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ""
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ""
  return (first + last).toUpperCase()
}

export function getAvatarColor(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  }
  return avatarColors[hash % avatarColors.length]
}
