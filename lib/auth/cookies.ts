import "server-only"
import { cookies } from "next/headers"

import { SESSION_COOKIE } from "@/lib/auth/constants"

export { SESSION_COOKIE }

const DAY = 60 * 60 * 24

export async function setSessionCookie(token: string, remember: boolean) {
  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: remember ? 30 * DAY : DAY,
  })
}

export async function clearSessionCookie() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}

export async function getSessionCookie(): Promise<string | undefined> {
  const store = await cookies()
  return store.get(SESSION_COOKIE)?.value
}
