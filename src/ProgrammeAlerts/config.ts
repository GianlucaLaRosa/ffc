import type { GlobalConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'
import { revalidateProgrammeAlerts } from '@/utilities/revalidatePublicCache'

export const ProgrammeAlerts: GlobalConfig = {
  slug: 'programme-alerts',
  label: 'Avvisi programma',
  access: {
    read: anyone,
    update: authenticated,
  },
  admin: {
    description:
      'Promemoria delle sessioni per My programme e impostazioni tecniche della push (usate anche dagli avvisi in Notices). Le chiavi restano nelle variabili d’ambiente; questa schermata è per chi pubblica.',
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Enable session alerts',
      defaultValue: true,
      admin: {
        description:
          'Se è spento, il sito nasconde “Enable session alerts” e il cron al minuto non invia nulla.',
      },
    },
    {
      name: 'contactEmail',
      type: 'email',
      label: 'Push contact email',
      admin: {
        description:
          'Contatto tecnico per i provider Web Push (VAPID). Non visibile ai partecipanti. Obbligatorio mentre gli avvisi sono accesi.',
      },
      validate: (value, { data }) => {
        const enabled = Boolean(data && typeof data === 'object' && 'enabled' in data && data.enabled)
        if (enabled && (value == null || String(value).trim() === '')) {
          return 'Obbligatorio quando Enable session alerts è acceso'
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
            description: 'Avvisare tanti minuti prima di una sessione salvata.',
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
            description: 'Nome breve sulle notifiche a schermo bloccato.',
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateProgrammeAlerts],
  },
}
