"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth/dal"
import { updateProfileSchema } from "@/lib/validation/settings"
import type { FormState } from "@/actions/types"

export async function updateProfile(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser()

  const parsed = updateProfileSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const { name, title, email, license } = parsed.data

  const emailTaken = await prisma.user.findFirst({
    where: { email, NOT: { id: user.id } },
    select: { id: true },
  })
  if (emailTaken) {
    return { fieldErrors: { email: ["That email is already in use."] } }
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { name, title: title || null, email, license: license || null },
  })

  revalidatePath("/settings")
  revalidatePath("/dashboard")
  return { success: true }
}
