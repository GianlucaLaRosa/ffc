import type { GlobalConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'
import { revalidateProgrammeAlerts } from '@/utilities/revalidatePublicCache'
import { copy } from '@/i18n/copy'
import { asT } from '@/i18n/asT'

export const ProgrammeAlerts: GlobalConfig = {
  slug: 'programme-alerts',
  label: copy('Programme alerts', 'Avvisi programma'),
  access: {
    read: anyone,
    update: authenticated,
  },
  admin: {
    description: copy(
      'Session reminders for My programme and technical push settings (also used by Notices). Keys stay in environment variables; this screen is for publishers.',
      'Promemoria delle sessioni per My programme e impostazioni tecniche della push (usate anche dagli avvisi in Notices). Le chiavi restano nelle variabili d’ambiente; questa schermata è per chi pubblica.',
    ),
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Enable session alerts',
      defaultValue: true,
      admin: {
        description: copy(
          'If off, the site hides “Enable session alerts” and the scheduled check sends nothing.',
          'Se è spento, il sito nasconde “Enable session alerts” e il controllo programmato non invia nulla.',
        ),
      },
    },
    {
      name: 'contactEmail',
      type: 'email',
      label: 'Push contact email',
      admin: {
        description: copy(
          'Technical contact for Web Push providers (VAPID). Not shown to participants. Required while alerts are on.',
          'Contatto tecnico per i provider Web Push (VAPID). Non visibile ai partecipanti. Obbligatorio mentre gli avvisi sono accesi.',
        ),
      },
      validate: (value, { data, req }) => {
        const enabled = Boolean(data && typeof data === 'object' && 'enabled' in data && data.enabled)
        if (enabled && (value == null || String(value).trim() === '')) {
          return asT(req.t)('fcr:pushContactRequired')
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
            width: '33%',
            description: copy(
              'How many minutes before a saved session to notify.',
              'Avvisare tanti minuti prima di una sessione salvata.',
            ),
            step: 1,
          },
        },
        {
          name: 'pollMinutes',
          type: 'select',
          label: 'Check interval',
          defaultValue: '5',
          options: [
            { label: '5 minutes', value: '5' },
            { label: '10 minutes', value: '10' },
            { label: '15 minutes', value: '15' },
            { label: '20 minutes', value: '20' },
            { label: '25 minutes', value: '25' },
            { label: '30 minutes', value: '30' },
          ],
          admin: {
            width: '33%',
            description: copy(
              'How often the server checks for due reminders. Set cron-job.org to the same interval.',
              'Ogni quanto il server controlla i promemoria. Impostate cron-job.org con lo stesso intervallo.',
            ),
          },
        },
        {
          name: 'notificationTitle',
          type: 'text',
          label: 'Notification title',
          defaultValue: 'FFC Conference',
          admin: {
            width: '34%',
            description: copy(
              'Short name on lock-screen notifications.',
              'Nome breve sulle notifiche a schermo bloccato.',
            ),
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateProgrammeAlerts],
  },
}
