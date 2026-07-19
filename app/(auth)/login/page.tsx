"use client"

import { useActionState } from "react"
import Link from "next/link"
import { LockIcon, MailIcon, LoaderCircleIcon, TriangleAlertIcon } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { logIn } from "@/actions/auth"
import { initialFormState } from "@/actions/types"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

export default function LoginPage() {
  const { t } = useTranslation()
  const [state, formAction, isPending] = useActionState(logIn, initialFormState)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">{t.auth.loginTitle}</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t.auth.loginSubtitle}
        </p>
      </div>

      <form action={formAction}>
        <FieldGroup>
          {state.error && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <TriangleAlertIcon className="size-4 shrink-0" />
              {state.error}
            </div>
          )}

          <Field>
            <FieldLabel htmlFor="email">{t.auth.email}</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <MailIcon />
              </InputGroupAddon>
              <InputGroupInput
                id="email"
                name="email"
                type="email"
                placeholder="dr.reeves@mindflow.health"
                required
              />
            </InputGroup>
            <FieldError errors={state.fieldErrors?.email?.map((message) => ({ message }))} />
          </Field>

          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="password">{t.auth.password}</FieldLabel>
              <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                {t.auth.forgotPassword}
              </Link>
            </div>
            <InputGroup>
              <InputGroupAddon>
                <LockIcon />
              </InputGroupAddon>
              <InputGroupInput id="password" name="password" type="password" placeholder="••••••••" required />
            </InputGroup>
          </Field>

          <Field orientation="horizontal">
            <Checkbox id="remember" name="remember" value="true" defaultChecked />
            <FieldLabel htmlFor="remember" className="font-normal">
              {t.auth.remember}
            </FieldLabel>
          </Field>

          <Button type="submit" size="lg" disabled={isPending}>
            {isPending && <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />}
            {isPending ? t.auth.signingIn : t.auth.signIn}
          </Button>
        </FieldGroup>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {t.auth.noAccount}{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          {t.auth.createOne}
        </Link>
      </p>
    </div>
  )
}
