import type { ServerProps, Where } from 'payload'

import { ConferenceArchiveNavLinkClient } from './index.client'

export default async function ConferenceArchiveNavLink({ payload }: ServerProps) {
  const active = await payload.findGlobal({
    slug: 'active-conference',
    depth: 0,
    select: {
      conference: true,
    },
  })

  const activeId =
    typeof active.conference === 'object' && active.conference !== null
      ? active.conference.id
      : active.conference

  const where: Where = {
    and: [
      { _status: { equals: 'published' } },
      ...(activeId != null ? [{ id: { not_equals: activeId } }] : []),
    ],
  }

  const [allPast, publicPast] = await Promise.all([
    payload.find({
      collection: 'conferences',
      depth: 0,
      draft: false,
      limit: 1,
      pagination: true,
      where,
      select: {
        title: true,
      },
    }),
    payload.find({
      collection: 'conferences',
      depth: 0,
      draft: false,
      limit: 1,
      pagination: true,
      where: {
        and: [...(where.and ?? []), { publicArchive: { equals: true } }],
      },
      select: {
        title: true,
      },
    }),
  ])

  return (
    <ConferenceArchiveNavLinkClient
      adminRoute={payload.config.routes.admin}
      enabledCount={publicPast.totalDocs}
      totalCount={allPast.totalDocs}
    />
  )
}
