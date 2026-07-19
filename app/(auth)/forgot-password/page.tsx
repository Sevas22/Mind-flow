"use client"

import * as React from "react"
import Link from "next/link"
import { MailIcon, LoaderCircleIcon, ArrowLeftIcon, CheckCircle2Icon } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

export default function ForgotPasswordPage() {
  const { t } = useTranslation()
  const [loading, setLoading] = React.useState(false)
  const [sent, setSent] = React.useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 900)
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-accent/10 text-accent">
          <CheckCircle2Icon className="size-7" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">{t.auth.sentTitle}</h1>
          <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
            {t.auth.sentText}
          </p>
        </div>
        <Button variant="outline" nativeButton={false} render={<Link href="/login" />}>
          <ArrowLeftIcon data-icon="inline-start" />
          {t.auth.backToSignIn}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">{t.auth.forgotTitle}</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t.auth.forgotSubtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">{t.auth.email}</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <MailIcon />
              </InputGroupAddon>
              <InputGroupInput id="email" type="email" placeholder="you@practice.health" required />
            </InputGroup>
          </Field>

          <Button type="submit" size="lg" disabled={loading}>
            {loading && <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />}
            {loading ? t.auth.sendingLink : t.auth.sendResetLink}
          </Button>
        </FieldGroup>
      </form>

      <Link
        href="/login"
        className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        {t.auth.backToSignIn}
      </Link>
    </div>
  )
}
