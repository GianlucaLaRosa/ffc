import type { GlobalConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'
import { clearActivePublicArchive } from './hooks/clearActivePublicArchive'
import { revalidateActiveConference } from './hooks/revalidateActiveConference'

export const ActiveConference: GlobalConfig = {
  slug: 'active-conference',
  label: 'Active conference',
  access: {
    read: anyone,
    update: authenticated,
  },
  admin: {
    // Custom NavLink + Site dashboard card show the selected conference title.
    group: false,
  },
  fields: [
    {
      name: 'conference',
      type: 'relationship',
      relationTo: 'conferences',
      label: 'Conference',
      required: true,
      admin: {
        description:
          'Published edition at the site root (/). Required. That edition is removed from the public archive automatically.',
      },
      filterOptions: {
        _status: {
          equals: 'published',
        },
      },
    },
  ],
  hooks: {
    afterChange: [clearActivePublicArchive, revalidateActiveConference],
  },
}
