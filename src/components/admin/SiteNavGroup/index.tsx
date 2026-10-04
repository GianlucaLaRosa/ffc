import type { ServerProps } from 'payload'

import ActiveConferenceNavLink from '@/ActiveConference/NavLink'
import ConferenceArchiveNavLink from '@/ConferenceArchive/NavLink'

import { SiteNavGroupClient } from './index.client'

export default async function SiteNavGroup(props: ServerProps) {
  return (
    <SiteNavGroupClient>
      <ActiveConferenceNavLink {...props} />
      <ConferenceArchiveNavLink {...props} />
    </SiteNavGroupClient>
  )
}
