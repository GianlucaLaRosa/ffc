import type { GlobalConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'
import { copy } from '@/i18n/copy'
import { toggleEnablePublicArchiveEndpoint } from './endpoints/toggleEnablePublicArchive'
import { revalidateConferenceArchive } from './hooks/revalidateConferenceArchive'

export const ConferenceArchive: GlobalConfig = {
  slug: 'conference-archive',
  label: copy('Conference archive', 'Archivio conferenze'),
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
  endpoints: [toggleEnablePublicArchiveEndpoint],
  hooks: {
    afterChange: [revalidateConferenceArchive],
  },
  fields: [
    {
      name: 'enablePublicArchive',
      type: 'checkbox',
      label: 'Enable public archive',
      defaultValue: true,
      admin: {
        hidden: true,
        description: copy(
          'When on, /archive and /archive/{slug} are public. When off, those URLs return 404 and Archive is hidden in the menu.',
          'Se acceso, /archive e /archive/{slug} sono pubblici. Se spento, quegli indirizzi danno 404 e Archive sparisce dal menu.',
        ),
      },
    },
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
