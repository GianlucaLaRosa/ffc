import type { GlobalConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'
import { clearActivePublicArchive } from './hooks/clearActivePublicArchive'
import { revalidateActiveConference } from './hooks/revalidateActiveConference'

export const ActiveConference: GlobalConfig = {
  slug: 'active-conference',
  label: 'Conferenza attiva',
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
          'Edizione pubblicata in home (/). Obbligatoria. Quell’edizione viene tolta automaticamente dall’archivio pubblico.',
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
