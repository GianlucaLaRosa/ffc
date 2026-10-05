import type { GlobalConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'
import { clearActivePublicArchive } from './hooks/clearActivePublicArchive'
import { revalidateActiveConference } from './hooks/revalidateActiveConference'
import { copy } from '@/i18n/copy'

export const ActiveConference: GlobalConfig = {
  slug: 'active-conference',
  label: copy('Active conference', 'Conferenza attiva'),
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
        description: copy(
          'Published edition on the home page (/). Required. That edition is removed from the public archive automatically.',
          'Edizione pubblicata in home (/). Obbligatoria. Quell’edizione viene tolta automaticamente dall’archivio pubblico.',
        ),
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
