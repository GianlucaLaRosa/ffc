import type { GlobalConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'
import { revalidateProgrammeAlerts } from '@/utilities/revalidatePublicCache'

export const ProgrammeAlerts: GlobalConfig = {
  slug: 'programme-alerts',
  label: 'Programme alerts',
  access: {
    read: anyone,
    update: authenticated,
  },
  admin: {
    description:
      'Session reminders for My programme. Push keys stay in environment variables; this screen is for editors.',
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Enable session alerts',
      defaultValue: true,
      admin: {
        description:
          'When off, the public site hides “Enable session alerts” and the minute cron sends nothing.',
      },
    },
    {
      name: 'contactEmail',
      type: 'email',
      label: 'Push contact email',
      admin: {
        description:
          'Technical contact for Web Push providers (VAPID). Not shown to attendees. Required while alerts are on.',
      },
      validate: (value, { data }) => {
        const enabled = Boolean(data && typeof data === 'object' && 'enabled' in data && data.enabled)
        if (enabled && (value == null || String(value).trim() === '')) {
          return 'Required when session alerts are enabled'
        }
        return true
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'leadMinutes',
          type: 'number',
          label: 'Minutes before start',
          defaultValue: 5,
          min: 1,
          max: 30,
          admin: {
            width: '50%',
            description: 'Warn this many minutes before a saved session.',
            step: 1,
          },
        },
        {
          name: 'notificationTitle',
          type: 'text',
          label: 'Notification title',
          defaultValue: 'FFC Conference',
          admin: {
            width: '50%',
            description: 'Short name on lock-screen notifications.',
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateProgrammeAlerts],
  },
}
