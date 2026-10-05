import type { ServerProps } from 'payload'

import { EditActiveEditionNavLinkClient } from './index.client'

export default async function EditActiveEditionNavLink({ payload }: ServerProps) {
  const data = await payload.findGlobal({
    slug: 'active-conference',
    depth: 1,
    select: {
      conference: true,
    },
  })

  const conference = data.conference
  const conferenceId =
    typeof conference === 'object' && conference !== null
      ? conference.id
      : conference

  if (conferenceId == null) return null

  const conferenceTitle =
    typeof conference === 'object' && conference !== null && 'title' in conference
      ? (conference.title ?? null)
      : null

  return (
    <EditActiveEditionNavLinkClient
      adminRoute={payload.config.routes.admin}
      conferenceId={conferenceId}
      conferenceTitle={conferenceTitle}
    />
  )
}
