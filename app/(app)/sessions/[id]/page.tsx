import { notFound } from "next/navigation"

import { requireUser } from "@/lib/auth/dal"
import { getSession } from "@/lib/data/sessions"
import { serializeSession } from "@/lib/serializers/session"
import { SessionDetailPageClient } from "@/app/(app)/sessions/[id]/session-detail-page-client"

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await requireUser()

  const session = await getSession(user.id, id)
  if (!session) notFound()

  return <SessionDetailPageClient session={serializeSession(session)} />
}
