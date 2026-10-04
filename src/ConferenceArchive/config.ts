import type { GlobalConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'

export const ConferenceArchive: GlobalConfig = {
  slug: 'conference-archive',
  label: 'Conference archive',
  access: {
    read: anyone,
    update: authenticated,
  },
  admin: {
    // Custom NavLink + Site dashboard card; list UI is the ArchiveManager field.
    group: false,
    components: {
      elements: {
        SaveButton: '@/ConferenceArchive/HideSaveButton#HideSaveButton',
      },
    },
  },
  fields: [
    {
      name: 'archiveManager',
      type: 'ui',
      admin: {
        components: {
          Field: '@/ConferenceArchive/ArchiveManager#ArchiveManager',
        },
      },
    },
  ],
}
