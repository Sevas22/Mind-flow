import "server-only"
import { cache } from "react"
import { redirect } from "next/navigation"

import { prisma } from "@/lib/prisma"
import { getSessionCookie } from "@/lib/auth/cookies"
import { verifySessionToken } from "@/lib/auth/session"

export const getCurrentUser = cache(async () => {
  const token = await getSessionCookie()
  if (!token) return null

  const payload = await verifySessionToken(token)
  if (!payload) return null

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
      title: true,
      license: true,
    },
  })

  return user
})

export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")
  return user
}
