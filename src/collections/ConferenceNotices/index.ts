import type {
  CollectionBeforeValidateHook,
  CollectionConfig,
  FilterOptions,
  TextFieldValidation,
} from 'payload'

import { authenticated } from '../../access/authenticated'
import {
  revalidateEditionByConference,
  revalidateEditionByConferenceDelete,
} from '@/utilities/revalidatePublicCache'
import { sendConferenceNoticeEndpoint } from './endpoints/sendNotice'

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
  (value: unknown): string | true => {
    if (typeof value !== 'string' || !value.trim()) return `${label} è obbligatorio.`
    if (value.trim().length > max) return `${label} deve avere al massimo ${max} caratteri.`
    return true
  }

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

const validateLinkPath: TextFieldValidation = (value) => {
  if (value == null || value === '') return true
  if (typeof value !== 'string') return 'Percorso non valido.'
  const trimmed = value.trim()
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return 'Usate un percorso di questo sito (inizia con / , ? o #), non un URL completo.'
  }
  if (!trimmed.startsWith('/') && !trimmed.startsWith('?') && !trimmed.startsWith('#')) {
    return 'Il percorso deve iniziare con /, ? o #.'
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
    singular: 'Avviso conferenza',
    plural: 'Avvisi conferenza',
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
    group: 'Conferenze',
    useAsTitle: 'title',
    defaultColumns: ['title', 'severity', 'showOnSite', 'sentAt', 'updatedAt'],
    description:
      'Cambiamenti in diretta sul programma. Si modificano dal tab Avvisi della conferenza. Usate Invia push per le notifiche a schermo bloccato.',
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
        description: 'Titolo breve per banner e schermo bloccato (max 40 caratteri).',
        components: {
          Field: '@/collections/ConferenceNotices/LimitedPlainTextField#LimitedTextField',
        },
      },
      validate: trimText(40, 'Title'),
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      maxLength: 120,
      label: 'Body',
      admin: {
        description: 'Solo testo (max 120 caratteri). Compare sul banner del sito e nella push.',
        components: {
          Field: '@/collections/ConferenceNotices/LimitedPlainTextField#LimitedTextareaField',
        },
      },
      validate: trimText(120, 'Body'),
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
            description: 'Colore del banner. Preferite Change per cambi di sala o orario.',
          },
        },
        {
          name: 'showOnSite',
          type: 'checkbox',
          label: 'Show site banner',
          defaultValue: true,
          admin: {
            width: '50%',
            description: 'Se è acceso, i visitatori vedono l’avviso sulla pagina pubblica dell’edizione.',
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
        description:
          'Se è acceso, Invia push recapita una notifica a schermo bloccato ai dispositivi iscritti di questa edizione.',
      },
    },
    {
      name: 'relatedAgendaItem',
      type: 'relationship',
      relationTo: 'agenda-items',
      label: 'Related session',
      filterOptions: filterAgendaByConference,
      admin: {
        description:
          'Facoltativo. La push arriva solo a chi ha salvato questa sessione (più chi è iscritto agli aggiornamenti della conferenza). Il banner resta visibile a tutti.',
      },
    },
    {
      name: 'linkPath',
      type: 'text',
      label: 'Link path',
      admin: {
        description:
          'Percorso facoltativo su questo sito, es. #programme o ?agenda=123. Vuoto apre la home dell’edizione (o la sessione collegata, se impostata).',
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
            description: 'Facoltativo. Banner nascosto prima di questo orario.',
          },
        },
        {
          name: 'expiresAt',
          type: 'date',
          label: 'Banner until',
          admin: {
            width: '50%',
            date: { pickerAppearance: 'dayAndTime' },
            description: 'Facoltativo. Banner nascosto dopo questo orario.',
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
            description: 'Compilato in automatico dopo un invio push riuscito.',
          },
        },
        {
          name: 'pushSent',
          type: 'number',
          label: 'Push delivered',
          admin: {
            width: '33%',
            readOnly: true,
            description: 'Dispositivi che hanno ricevuto l’ultimo invio.',
          },
        },
        {
          name: 'pushRemoved',
          type: 'number',
          label: 'Stale endpoints removed',
          admin: {
            width: '33%',
            readOnly: true,
            description: 'Endpoint push scaduti o assenti, puliti all’ultimo invio.',
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
        description: 'Edizione a cui appartiene questo avviso.',
      },
    },
  ],
  hooks: {
    beforeValidate: [normalizeDates],
    afterChange: [revalidateEditionByConference],
    afterDelete: [revalidateEditionByConferenceDelete],
  },
}
