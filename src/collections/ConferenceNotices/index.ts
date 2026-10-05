import type {
  CollectionBeforeValidateHook,
  CollectionConfig,
  FilterOptions,
  PayloadRequest,
  TextareaFieldValidation,
  TextFieldValidation,
} from 'payload'

import { authenticated } from '../../access/authenticated'
import {
  revalidateEditionByConference,
  revalidateEditionByConferenceDelete,
} from '@/utilities/revalidatePublicCache'
import { sendConferenceNoticeEndpoint } from './endpoints/sendNotice'
import { adminGroups, copy } from '@/i18n/copy'
import { asT } from '@/i18n/asT'

const toRelationId = (value: unknown): number | string | null => {
  if (value == null) return null
  if (typeof value === 'object' && value !== null && 'id' in value) {
    return (value as { id: number | string }).id
  }
  if (typeof value === 'number' || typeof value === 'string') return value
  return null
}

const trimText =
  (max: number, label: string) =>
  (value: unknown, { req }: { req: PayloadRequest }) => {
    if (typeof value !== 'string' || !value.trim()) return asT(req.t)('fcr:requiredNamed', { label })
    if (value.trim().length > max) return asT(req.t)('fcr:maxCharsNamed', { label, max })
    return true
  }

const trimTitle: TextFieldValidation = (value, args) => trimText(40, 'Title')(value, args)
const trimBody: TextareaFieldValidation = (value, args) => trimText(120, 'Body')(value, args)

const filterAgendaByConference: FilterOptions = async ({ data, req }) => {
  const conferenceId = toRelationId(data?.conference)
  if (conferenceId == null) return false

  const days = await req.payload.find({
    collection: 'conference-days',
    where: { conference: { equals: conferenceId } },
    depth: 0,
    draft: true,
    limit: 100,
    pagination: false,
    overrideAccess: true,
    req,
  })

  const dayIds = days.docs.map((day) => day.id)
  if (dayIds.length === 0) return false

  return { day: { in: dayIds } }
}

const validateLinkPath: TextFieldValidation = (value, { req }) => {
  if (value == null || value === '') return true
  if (typeof value !== 'string') return asT(req.t)('fcr:invalidPath')
  const trimmed = value.trim()
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return asT(req.t)('fcr:useSitePath')
  }
  if (!trimmed.startsWith('/') && !trimmed.startsWith('?') && !trimmed.startsWith('#')) {
    return asT(req.t)('fcr:pathPrefix')
  }
  return true
}

const normalizeDates: CollectionBeforeValidateHook = ({ data }) => {
  if (!data) return data

  if (typeof data.title === 'string') data.title = data.title.trim()
  if (typeof data.body === 'string') data.body = data.body.trim()
  if (typeof data.linkPath === 'string') data.linkPath = data.linkPath.trim()

  return data
}

export const ConferenceNotices: CollectionConfig<'conference-notices'> = {
  slug: 'conference-notices',
  labels: {
    singular: copy('Conference notice', 'Avviso conferenza'),
    plural: copy('Conference notices', 'Avvisi conferenza'),
  },
  orderable: true,
  access: {
    create: authenticated,
    delete: authenticated,
    read: ({ req: { user } }) => {
      if (user) return true
      return { showOnSite: { equals: true } }
    },
    update: authenticated,
  },
  admin: {
    hidden: true,
    group: adminGroups.conferences,
    useAsTitle: 'title',
    defaultColumns: ['title', 'severity', 'showOnSite', 'sentAt', 'updatedAt'],
    description: copy(
      'Live programme changes. Edit them from the conference Notices tab. Use Send push for lock-screen notifications.',
      'Cambiamenti in diretta sul programma. Si modificano dal tab Avvisi della conferenza. Usate Invia push per le notifiche a schermo bloccato.',
    ),
  },
  endpoints: [sendConferenceNoticeEndpoint],
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 40,
      label: 'Title',
      admin: {
        description: copy(
          'Short title for the banner and lock screen (max 40 characters).',
          'Titolo breve per banner e schermo bloccato (max 40 caratteri).',
        ),
        components: {
          Field: '@/collections/ConferenceNotices/LimitedPlainTextField#LimitedTextField',
        },
      },
      validate: trimTitle,
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      maxLength: 120,
      label: 'Body',
      admin: {
        description: copy(
          'Plain text only (max 120 characters). Appears on the site banner and in the push.',
          'Solo testo (max 120 caratteri). Compare sul banner del sito e nella push.',
        ),
        components: {
          Field: '@/collections/ConferenceNotices/LimitedPlainTextField#LimitedTextareaField',
        },
      },
      validate: trimBody,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'severity',
          type: 'select',
          required: true,
          defaultValue: 'change',
          label: 'Severity',
          options: [
            { label: 'Info', value: 'info' },
            { label: 'Change', value: 'change' },
            { label: 'Urgent', value: 'urgent' },
          ],
          admin: {
            width: '50%',
            description: copy(
              'Banner colour. Prefer Change for room or time changes.',
              'Colore del banner. Preferite Change per cambi di sala o orario.',
            ),
          },
        },
        {
          name: 'showOnSite',
          type: 'checkbox',
          label: 'Show site banner',
          defaultValue: true,
          admin: {
            width: '50%',
            description: copy(
              'If on, visitors see the notice on the edition’s public page.',
              'Se è acceso, i visitatori vedono l’avviso sulla pagina pubblica dell’edizione.',
            ),
          },
        },
      ],
    },
    {
      name: 'sendPush',
      type: 'checkbox',
      label: 'Include push when sending',
      defaultValue: true,
      admin: {
        description: copy(
          'If on, Send push delivers a lock-screen notification to subscribed devices of this edition.',
          'Se è acceso, Invia push recapita una notifica a schermo bloccato ai dispositivi iscritti di questa edizione.',
        ),
      },
    },
    {
      name: 'relatedAgendaItem',
      type: 'relationship',
      relationTo: 'agenda-items',
      label: 'Related session',
      filterOptions: filterAgendaByConference,
      admin: {
        description: copy(
          'Optional. The push goes to people who saved this item, a talk inside it, or a linked abstract, plus people subscribed to conference updates. The banner stays visible to everyone.',
          'Facoltativo. La push arriva a chi ha salvato questa voce, un talk dentro di essa, o un abstract collegato, più chi è iscritto agli aggiornamenti della conferenza. Il banner resta visibile a tutti.',
        ),
      },
    },
    {
      name: 'linkPath',
      type: 'text',
      label: 'Link path',
      admin: {
        description: copy(
          'Optional path on this site, e.g. #programme or ?agenda=123. Empty opens the edition home (or the linked session, if set).',
          'Percorso facoltativo su questo sito, es. #programme o ?agenda=123. Vuoto apre la home dell’edizione (o la sessione collegata, se impostata).',
        ),
      },
      validate: validateLinkPath,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startsAt',
          type: 'date',
          label: 'Banner from',
          admin: {
            width: '50%',
            date: { pickerAppearance: 'dayAndTime' },
            description: copy(
              'Optional. Banner hidden before this time.',
              'Facoltativo. Banner nascosto prima di questo orario.',
            ),
          },
        },
        {
          name: 'expiresAt',
          type: 'date',
          label: 'Banner until',
          admin: {
            width: '50%',
            date: { pickerAppearance: 'dayAndTime' },
            description: copy(
              'Optional. Banner hidden after this time.',
              'Facoltativo. Banner nascosto dopo questo orario.',
            ),
          },
        },
      ],
    },
    {
      name: 'sendActions',
      type: 'ui',
      admin: {
        components: {
          Field: '@/collections/ConferenceNotices/SendNoticeField#SendNoticeField',
        },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'sentAt',
          type: 'date',
          label: 'Push sent at',
          admin: {
            width: '34%',
            readOnly: true,
            date: { pickerAppearance: 'dayAndTime' },
            description: copy(
              'Filled automatically after a successful push send.',
              'Compilato in automatico dopo un invio push riuscito.',
            ),
          },
        },
        {
          name: 'pushSent',
          type: 'number',
          label: 'Push delivered',
          admin: {
            width: '33%',
            readOnly: true,
            description: copy(
              'Devices that received the last send.',
              'Dispositivi che hanno ricevuto l’ultimo invio.',
            ),
          },
        },
        {
          name: 'pushRemoved',
          type: 'number',
          label: 'Stale endpoints removed',
          admin: {
            width: '33%',
            readOnly: true,
            description: copy(
              'Expired or missing push endpoints, cleaned on the last send.',
              'Endpoint push scaduti o assenti, puliti all’ultimo invio.',
            ),
          },
        },
      ],
    },
    {
      name: 'conference',
      type: 'relationship',
      relationTo: 'conferences',
      required: true,
      index: true,
      label: 'Conference',
      admin: {
        position: 'sidebar',
        description: copy(
          'Edition this notice belongs to.',
          'Edizione a cui appartiene questo avviso.',
        ),
      },
    },
  ],
  hooks: {
    beforeValidate: [normalizeDates],
    afterChange: [revalidateEditionByConference],
    afterDelete: [revalidateEditionByConferenceDelete],
  },
}
