"use client"

import * as React from "react"
import { useActionState } from "react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import {
  SunIcon,
  MoonIcon,
  MonitorIcon,
  DownloadIcon,
  ShieldCheckIcon,
} from "lucide-react"

import { getAvatarColor, getInitials } from "@/lib/avatar"
import { formatDate } from "@/lib/format"
import { cn } from "@/lib/utils"
import { locales, localeLabels, type Locale } from "@/lib/i18n"
import { useTranslation } from "@/hooks/use-translation"
import { updateProfile } from "@/actions/settings"
import { initialFormState } from "@/actions/types"
import { PageHeader } from "@/components/page-header"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CurrentUser {
  id: string
  name: string
  email: string
  title: string | null
  license: string | null
}

function ToggleRow({
  title,
  description,
  defaultChecked = true,
}: {
  title: string
  description: string
  defaultChecked?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  )
}

function saveHandler(message: string, description?: string) {
  return (e: React.FormEvent) => {
    e.preventDefault()
    toast.success(message, { description })
  }
}

function AppearancePicker() {
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const options = [
    { value: "light", label: t.settings.light, icon: SunIcon },
    { value: "dark", label: t.settings.dark, icon: MoonIcon },
    { value: "system", label: t.settings.system, icon: MonitorIcon },
  ] as const

  return (
    <div className="grid grid-cols-3 gap-3">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => setTheme(o.value)}
          className={cn(
            "flex flex-col items-center gap-2 rounded-lg border border-border p-4 text-sm font-medium transition-colors hover:border-primary/40",
            mounted && theme === o.value && "border-primary bg-primary/[0.06] text-primary",
          )}
        >
          <o.icon className="size-5" />
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function SettingsPageClient({ user }: { user: CurrentUser }) {
  const { t, locale, setLocale } = useTranslation()
  const [state, formAction, isPending] = useActionState(updateProfile, initialFormState)

  React.useEffect(() => {
    if (state.success) {
      toast.success(t.settings.profileSavedToast, {
        description: t.settings.profileSavedToastDesc,
      })
    }
  }, [state])

  return (
    <>
      <PageHeader
        title={t.settings.title}
        description={t.settings.subtitle}
      />

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">{t.settings.tabProfile}</TabsTrigger>
          <TabsTrigger value="notifications">{t.settings.tabNotifications}</TabsTrigger>
          <TabsTrigger value="security">{t.settings.tabSecurity}</TabsTrigger>
          <TabsTrigger value="appearance">{t.settings.tabAppearance}</TabsTrigger>
          <TabsTrigger value="language">{t.settings.tabLanguage}</TabsTrigger>
          <TabsTrigger value="backup">{t.settings.tabBackup}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.settings.profileTitle}</CardTitle>
              <CardDescription>{t.settings.profileDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={formAction}>
                <FieldGroup>
                  {state.error && (
                    <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                      {state.error}
                    </p>
                  )}
                  <div className="flex items-center gap-4">
                    <Avatar size="lg" className={getAvatarColor(user.id)}>
                      <AvatarFallback className={getAvatarColor(user.id)}>
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                      <Button type="button" variant="outline" size="sm" className="w-fit">
                        {t.settings.changePhoto}
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        {t.settings.photoHint}
                      </span>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="st-name">{t.settings.fullName}</FieldLabel>
                      <Input id="st-name" name="name" defaultValue={user.name} />
                      <FieldError errors={state.fieldErrors?.name?.map((message) => ({ message }))} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="st-title">{t.settings.titleField}</FieldLabel>
                      <Input id="st-title" name="title" defaultValue={user.title ?? ""} />
                    </Field>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="st-email">{t.settings.email}</FieldLabel>
                      <Input id="st-email" name="email" type="email" defaultValue={user.email} />
                      <FieldError errors={state.fieldErrors?.email?.map((message) => ({ message }))} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="st-license">{t.settings.license}</FieldLabel>
                      <Input id="st-license" name="license" defaultValue={user.license ?? ""} />
                    </Field>
                  </div>
                  <Button type="submit" className="w-fit" disabled={isPending}>
                    {t.settings.saveChanges}
                  </Button>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.settings.notificationsTitle}</CardTitle>
              <CardDescription>{t.settings.notificationsDescription}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col divide-y divide-border">
              <ToggleRow
                title={t.settings.emailRemindersTitle}
                description={t.settings.emailRemindersDesc}
              />
              <ToggleRow
                title={t.settings.sessionRemindersTitle}
                description={t.settings.sessionRemindersDesc}
              />
              <ToggleRow
                title={t.settings.newPatientAlertsTitle}
                description={t.settings.newPatientAlertsDesc}
              />
              <ToggleRow
                title={t.settings.weeklySummaryTitle}
                description={t.settings.weeklySummaryDesc}
                defaultChecked={false}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.settings.changePasswordTitle}</CardTitle>
                <CardDescription>{t.settings.changePasswordDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={saveHandler(t.settings.passwordUpdatedToast)}>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="st-current">{t.settings.currentPassword}</FieldLabel>
                      <Input id="st-current" type="password" placeholder="••••••••" />
                    </Field>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="st-new">{t.settings.newPassword}</FieldLabel>
                        <Input id="st-new" type="password" placeholder="••••••••" />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="st-confirm">{t.settings.confirmPassword}</FieldLabel>
                        <Input id="st-confirm" type="password" placeholder="••••••••" />
                      </Field>
                    </div>
                    <Button type="submit" className="w-fit">
                      {t.settings.updatePassword}
                    </Button>
                  </FieldGroup>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <ShieldCheckIcon className="size-4 text-primary" />
                <CardTitle>{t.settings.twoFactorTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <ToggleRow
                  title={t.settings.twoFactorRowTitle}
                  description={t.settings.twoFactorRowDesc}
                  defaultChecked={false}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.settings.appearanceTitle}</CardTitle>
              <CardDescription>{t.settings.appearanceDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <AppearancePicker />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="language" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.settings.languageTitle}</CardTitle>
              <CardDescription>{t.settings.languageDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <Field className="max-w-xs">
                <FieldLabel>{t.settings.displayLanguage}</FieldLabel>
                <Select
                  value={locale}
                  onValueChange={(value: Locale | null) => {
                    if (!value) return
                    setLocale(value)
                    toast.success(t.settings.languageSavedToast)
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {locales.map((l) => (
                        <SelectItem key={l} value={l}>
                          {localeLabels[l]}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.settings.backupTitle}</CardTitle>
              <CardDescription>{t.settings.backupDescription}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3 text-sm">
                <span className="text-muted-foreground">{t.settings.lastBackup}</span>
                <span className="font-medium">
                  {formatDate(new Date().toISOString().slice(0, 10), "full")}
                </span>
              </div>
              <ToggleRow
                title={t.settings.autoBackupTitle}
                description={t.settings.autoBackupDesc}
              />
              <Button
                variant="outline"
                className="w-fit"
                onClick={() =>
                  toast.success(t.settings.exportToast, {
                    description: t.settings.exportToastDesc,
                  })
                }
              >
                <DownloadIcon data-icon="inline-start" />
                {t.settings.exportData}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}
