"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboardIcon,
  UsersIcon,
  CalendarIcon,
  NotebookPenIcon,
  BarChart3Icon,
  SettingsIcon,
  BrainIcon,
  ChevronsUpDownIcon,
  LogOutIcon,
  UserIcon,
  LifeBuoyIcon,
} from "lucide-react"

import { logOut } from "@/actions/auth"
import { getInitials } from "@/lib/avatar"
import { useTranslation } from "@/hooks/use-translation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface CurrentUser {
  name: string
  email: string
  title: string | null
}

export function AppSidebar({ user }: { user: CurrentUser }) {
  const pathname = usePathname()
  const { t } = useTranslation()

  const mainNav = [
    { title: t.nav.dashboard, href: "/dashboard", icon: LayoutDashboardIcon },
    { title: t.nav.patients, href: "/patients", icon: UsersIcon },
    { title: t.nav.calendar, href: "/calendar", icon: CalendarIcon },
    { title: t.nav.sessions, href: "/sessions", icon: NotebookPenIcon },
    { title: t.nav.reports, href: "/reports", icon: BarChart3Icon },
  ]

  const secondaryNav = [
    { title: t.nav.settings, href: "/settings", icon: SettingsIcon },
  ]

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/")

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href="/dashboard" />}
              className="gap-3"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BrainIcon className="size-5" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">MindFlow</span>
                <span className="text-xs text-muted-foreground">
                  {t.nav.tagline}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isActive(item.href)}
                    tooltip={item.title}
                    render={<Link href={item.href} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isActive(item.href)}
                    tooltip={item.title}
                    render={<Link href={item.href} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={t.nav.helpSupport}>
                  <LifeBuoyIcon />
                  <span>{t.nav.helpSupport}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent"
                  />
                }
              >
                <Avatar className="size-8 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col gap-0.5 text-left leading-none">
                  <span className="truncate text-sm font-medium">
                    {user.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.title}
                  </span>
                </div>
                <ChevronsUpDownIcon className="ml-auto size-4 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="end"
                className="w-56"
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {user.email}
                    </span>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem render={<Link href="/settings" />}>
                    <UserIcon />
                    {t.nav.profile}
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/settings" />}>
                    <SettingsIcon />
                    {t.nav.settings}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    void logOut()
                  }}
                >
                  <LogOutIcon />
                  {t.nav.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
