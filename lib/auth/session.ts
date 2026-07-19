import { SignJWT, jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.AUTH_SECRET!)

export interface SessionPayload {
  userId: string
  email: string
}

export async function signSessionToken(
  payload: SessionPayload,
  expiresIn: string,
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret)
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    if (typeof payload.userId === "string" && typeof payload.email === "string") {
      return { userId: payload.userId, email: payload.email }
    }
    return null
  } catch {
    return null
  }
}
