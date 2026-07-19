"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SearchIcon, BellIcon, PlusIcon, CheckIcon } from "lucide-react"

import { useTranslation } from "@/hooks/use-translation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NewPatientDialog } from "@/components/dialogs/new-patient-dialog"

interface SearchPatient {
  id: string
  name: string
  reason: string
  status: string
  avatarColor: string
  initials: string
}

interface NavReminder {
  id: string
  patientId: string
  patientName: string
  text: string
  priority: "high" | "medium" | "low"
}

export function AppNavbar({
  patients,
  reminders,
}: {
  patients: SearchPatient[]
  reminders: NavReminder[]
}) {
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const { t } = useTranslation()

  const titleMap: Record<string, string> = {
    "/dashboard": t.navbar.titleDashboard,
    "/patients": t.navbar.titlePatients,
    "/calendar": t.navbar.titleCalendar,
    "/sessions": t.navbar.titleSessions,
    "/reports": t.navbar.titleReports,
    "/settings": t.navbar.titleSettings,
  }

  const title =
    titleMap[pathname] ??
    (pathname.startsWith("/patients/")
      ? t.navbar.titlePatientProfile
      : pathname.startsWith("/sessions/")
        ? t.navbar.titleSessionDetail
        : t.navbar.titleDefault)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((o) => !o)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const results = query
    ? patients.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()),
      )
    : patients.slice(0, 5)

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur-md">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 h-5" />
      <h1 className="text-base font-semibold">{title}</h1>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="outline"
          className="hidden h-9 w-56 justify-start gap-2 text-muted-foreground sm:flex"
          onClick={() => setSearchOpen(true)}
        >
          <SearchIcon />
          <span className="flex-1 text-left text-sm">{t.navbar.searchPatients}</span>
          <kbd className="pointer-events-none rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          onClick={() => setSearchOpen(true)}
          aria-label={t.navbar.search}
        >
          <SearchIcon />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" aria-label={t.navbar.notifications} />
            }
          >
            <div className="relative">
              <BellIcon />
              {reminders.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-destructive" />
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>{t.navbar.notifications}</span>
                <Badge variant="secondary">{reminders.length} {t.navbar.newLabel}</Badge>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <div className="flex max-h-80 flex-col gap-1 overflow-y-auto p-1">
              {reminders.length === 0 && (
                <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                  {t.navbar.noReminders}
                </p>
              )}
              {reminders.map((r) => (
                <Link
                  key={r.id}
                  href={`/patients/${r.patientId}`}
                  className="flex items-start gap-3 rounded-md p-2 transition-colors hover:bg-muted"
                >
                  <span
                    className={`mt-1 size-2 shrink-0 rounded-full ${
                      r.priority === "high"
                        ? "bg-destructive"
                        : r.priority === "medium"
                          ? "bg-warning"
                          : "bg-muted-foreground"
                    }`}
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium leading-tight">
                      {r.patientName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {r.text}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />

        <Separator orientation="vertical" className="mx-1 h-5" />

        <NewPatientDialog
          trigger={
            <Button size="sm">
              <PlusIcon data-icon="inline-start" />
              <span className="hidden sm:inline">{t.navbar.newPatient}</span>
            </Button>
          }
        />
      </div>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="top-24 max-w-lg translate-y-0 gap-0 p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>{t.navbar.search}</DialogTitle>
            <DialogDescription>{t.navbar.searchPatients}</DialogDescription>
          </DialogHeader>
          <div className="border-b border-border p-2">
            <InputGroup>
              <InputGroupInput
                autoFocus
                placeholder={t.navbar.searchPatients}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div className="flex max-h-80 flex-col gap-1 overflow-y-auto p-2">
            <p className="px-2 py-1 text-xs font-medium text-muted-foreground">
              {t.navbar.patientsLabel}
            </p>
            {results.length === 0 && (
              <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                {t.navbar.noPatientsFound}
              </p>
            )}
            {results.map((p) => (
              <Link
                key={p.id}
                href={`/patients/${p.id}`}
                onClick={() => setSearchOpen(false)}
                className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted"
              >
                <Avatar className={`size-8 ${p.avatarColor}`}>
                  <AvatarFallback className={p.avatarColor}>
                    {p.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{p.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {p.reason}
                  </span>
                </div>
                {p.status === "active" && (
                  <CheckIcon className="ml-auto size-4 text-success" />
                )}
              </Link>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}
