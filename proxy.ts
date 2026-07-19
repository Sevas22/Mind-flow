import { NextResponse, type NextRequest } from "next/server"
import { jwtVerify } from "jose"

import { SESSION_COOKIE } from "@/lib/auth/constants"

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/patients",
  "/calendar",
  "/sessions",
  "/reports",
  "/settings",
]
const AUTH_ONLY_PATHS = ["/login", "/register"]

const secret = new TextEncoder().encode(process.env.AUTH_SECRET!)

async function hasValidSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value
  if (!token) return false
  try {
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authenticated = await hasValidSession(request)

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  )
  const isAuthOnly = AUTH_ONLY_PATHS.includes(pathname)

  if (isProtected && !authenticated) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  if (isAuthOnly && authenticated) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|woff2?)$).*)",
  ],
}
