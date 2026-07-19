"use client"

import type React from "react"
import {
  BrainIcon,
  ShieldCheckIcon,
  CalendarHeartIcon,
  NotebookPenIcon,
} from "lucide-react"

import { useTranslation } from "@/hooks/use-translation"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { t } = useTranslation()

  const highlights = [
    {
      icon: NotebookPenIcon,
      title: t.auth.highlight1Title,
      text: t.auth.highlight1Text,
    },
    {
      icon: CalendarHeartIcon,
      title: t.auth.highlight2Title,
      text: t.auth.highlight2Text,
    },
    {
      icon: ShieldCheckIcon,
      title: t.auth.highlight3Title,
      text: t.auth.highlight3Text,
    },
  ]

  return (
    <main className="flex min-h-svh bg-background">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary-foreground/15">
            <BrainIcon className="size-6" />
          </span>
          <span className="text-lg font-semibold">MindFlow</span>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-semibold leading-tight text-balance">
              {t.auth.heroTitle}
            </h1>
            <p className="max-w-md text-primary-foreground/80 text-pretty">
              {t.auth.heroText}
            </p>
          </div>
          <ul className="flex flex-col gap-5">
            {highlights.map((h) => (
              <li key={h.title} className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/15">
                  <h.icon className="size-4.5" />
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">{h.title}</span>
                  <span className="text-sm text-primary-foreground/75">
                    {h.text}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-primary-foreground/60">
          {t.auth.trust}
        </p>
      </div>

      <div className="flex w-full flex-col items-center justify-center p-6 lg:w-1/2">
        <div className="flex w-full max-w-sm flex-col gap-8">
          <div className="flex items-center gap-2.5 lg:hidden">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <BrainIcon className="size-6" />
            </span>
            <span className="text-lg font-semibold">MindFlow</span>
          </div>
          {children}
        </div>
      </div>
    </main>
  )
}
