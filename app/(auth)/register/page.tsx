"use client"

import { useActionState } from "react"
import Link from "next/link"
import { LockIcon, MailIcon, UserIcon, LoaderCircleIcon, TriangleAlertIcon } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { signUp } from "@/actions/auth"
import { initialFormState } from "@/actions/types"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RegisterPage() {
  const { t } = useTranslation()
  const [state, formAction, isPending] = useActionState(signUp, initialFormState)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">{t.auth.registerTitle}</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t.auth.registerSubtitle}
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
            <FieldLabel htmlFor="name">{t.auth.fullName}</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <UserIcon />
              </InputGroupAddon>
              <InputGroupInput id="name" name="name" placeholder="Dr. Elena Reeves" required />
            </InputGroup>
            <FieldError errors={state.fieldErrors?.name?.map((message) => ({ message }))} />
          </Field>

          <Field>
            <FieldLabel htmlFor="email">{t.auth.email}</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <MailIcon />
              </InputGroupAddon>
              <InputGroupInput id="email" name="email" type="email" placeholder="you@practice.health" required />
            </InputGroup>
            <FieldError errors={state.fieldErrors?.email?.map((message) => ({ message }))} />
          </Field>

          <Field>
            <FieldLabel htmlFor="specialty">{t.auth.specialty}</FieldLabel>
            <Select name="title" defaultValue={t.auth.specialtyClinical}>
              <SelectTrigger id="specialty">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={t.auth.specialtyClinical}>{t.auth.specialtyClinical}</SelectItem>
                <SelectItem value={t.auth.specialtyCounseling}>{t.auth.specialtyCounseling}</SelectItem>
                <SelectItem value={t.auth.specialtyChild}>{t.auth.specialtyChild}</SelectItem>
                <SelectItem value={t.auth.specialtyNeuro}>{t.auth.specialtyNeuro}</SelectItem>
                <SelectItem value={t.auth.specialtyCbt}>{t.auth.specialtyCbt}</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="password">{t.auth.password}</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <LockIcon />
              </InputGroupAddon>
              <InputGroupInput
                id="password"
                name="password"
                type="password"
                placeholder={t.auth.createStrongPassword}
                required
              />
            </InputGroup>
            <FieldDescription>{t.auth.passwordHint}</FieldDescription>
            <FieldError errors={state.fieldErrors?.password?.map((message) => ({ message }))} />
          </Field>

          <Button type="submit" size="lg" disabled={isPending}>
            {isPending && <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />}
            {isPending ? t.auth.creatingAccount : t.auth.createAccount}
          </Button>
        </FieldGroup>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {t.auth.haveAccount}{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          {t.auth.signIn}
        </Link>
      </p>
    </div>
  )
}
