export function BarChart({
  data,
  color = "bg-primary",
}: {
  data: { label: string; value: number }[]
  color?: string
}) {
  const max = Math.max(...data.map((d) => d.value))

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end gap-3" style={{ height: 160 }}>
        {data.map((d) => (
          <div
            key={d.label}
            className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
          >
            <span className="text-[11px] font-medium tabular-nums text-foreground/70">
              {d.value}
            </span>
            <div
              title={`${d.label}: ${d.value}`}
              className={`w-full max-w-9 rounded-t-md ${color}`}
              style={{
                height: `${Math.max((d.value / max) * 100, 3)}%`,
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-3 border-t border-border pt-2">
        {data.map((d) => (
          <span
            key={d.label}
            className="flex-1 text-center text-[11px] text-muted-foreground"
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  )
}
