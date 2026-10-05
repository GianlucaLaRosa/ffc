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
          'When on, Archive appears in the site menu if at least one edition is listed. When off, the menu item is hidden; /archive and /archive/{slug} stay available.',
          'Se acceso, Archive compare nel menu del sito se almeno un’edizione è in elenco. Se spento, la voce di menu sparisce; /archive e /archive/{slug} restano raggiungibili.',
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
