"use server"

import { redirect } from "next/navigation"

import { prisma } from "@/lib/prisma"
import { hashPassword, verifyPassword } from "@/lib/auth/password"
import { signSessionToken } from "@/lib/auth/session"
import { setSessionCookie, clearSessionCookie } from "@/lib/auth/cookies"
import { signUpSchema, logInSchema } from "@/lib/validation/auth"
import type { FormState } from "@/actions/types"

const MAX_FAILED_ATTEMPTS = 5
const LOCK_MINUTES = 15

export async function signUp(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const { name, email, password, title } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return { error: "An account with that email already exists." }
  }

  const passwordHash = await hashPassword(password)
  const user = await prisma.user.create({
    data: { name, email, passwordHash, title },
  })

  const token = await signSessionToken(
    { userId: user.id, email: user.email },
    "24h",
  )
  await setSessionCookie(token, false)
  redirect("/dashboard")
}

export async function logIn(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = logInSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const { email, password, remember } = parsed.data
  const genericError = "Invalid email or password."

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return { error: genericError }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return {
      error: "Too many failed attempts. Try again in a few minutes.",
    }
  }

  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) {
    const attempts = user.failedLoginAttempts + 1
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: attempts,
        lockedUntil:
          attempts >= MAX_FAILED_ATTEMPTS
            ? new Date(Date.now() + LOCK_MINUTES * 60 * 1000)
            : null,
      },
    })
    return { error: genericError }
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { failedLoginAttempts: 0, lockedUntil: null },
  })

  const token = await signSessionToken(
    { userId: user.id, email: user.email },
    remember ? "30d" : "24h",
  )
  await setSessionCookie(token, !!remember)
  redirect("/dashboard")
}

export async function logOut(): Promise<void> {
  await clearSessionCookie()
  redirect("/login")
}
