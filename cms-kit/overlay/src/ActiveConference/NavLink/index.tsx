import type { ServerProps } from 'payload'

import { ActiveConferenceNavLinkClient } from './index.client'

export default async function ActiveConferenceNavLink({ payload }: ServerProps) {
  const data = await payload.findGlobal({
    slug: 'active-conference',
    depth: 1,
    select: {
      conference: true,
    },
  })

  const conference = data.conference
  const conferenceTitle =
    typeof conference === 'object' && conference !== null && 'title' in conference
      ? (conference.title ?? null)
      : null

  return (
    <ActiveConferenceNavLinkClient
      adminRoute={payload.config.routes.admin}
      conferenceTitle={conferenceTitle}
    />
  )
}
