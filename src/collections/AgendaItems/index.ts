import type {
  CollectionBeforeValidateHook,
  CollectionConfig,
  FilterOptions,
  Where,
} from 'payload'
import { ValidationError } from 'payload'
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { basicLexical } from '../../fields/basicLexical'
import { iconField } from '../../fields/icon'
import { durationMinutes, isTimeWithinWindow, minutesUtc } from './timeUtils'
import {
  revalidateEditionByDay,
  revalidateEditionByDayDelete,
} from '@/utilities/revalidatePublicCache'

type LexicalJSON = Parameters<typeof convertLexicalToPlaintext>[0]['data']

const toRelationId = (value: unknown): number | string | null => {
  if (value == null) return null
  if (typeof value === 'object' && value !== null && 'id' in value) {
    return (value as { id: number | string }).id
  }
  if (typeof value === 'number' || typeof value === 'string') return value
  return null
}

const toPlainTitle = (name: LexicalJSON): string =>
  convertLexicalToPlaintext({ data: name }).replace(/\s+/g, ' ').trim()

const populateTitleFromName: CollectionBeforeValidateHook = ({ data }) => {
  if (!data?.name) return data

  const plaintext = toPlainTitle(data.name as LexicalJSON)

  if (plaintext) {
    data.title = plaintext
  }

  return data
}

/** When nested under a parent, inherit the parent's conference day if missing. */
const inheritDayFromParent: CollectionBeforeValidateHook = async ({ data, originalDoc, req }) => {
  if (!data) return data

  const dayId = toRelationId(data.day ?? originalDoc?.day)
  if (dayId != null) return data

  const parentId = toRelationId(data.parent ?? originalDoc?.parent)
  if (parentId == null) return data

  const parent = await req.payload.findByID({
    collection: 'agenda-items',
    id: parentId,
    depth: 0,
    draft: true,
    overrideAccess: true,
    req,
    select: { day: true },
  })

  const parentDayId = toRelationId(parent?.day)
  if (parentDayId != null) {
    data.day = parentDayId
  }

  return data
}

const ensureTimesWithinDay: CollectionBeforeValidateHook = async ({
  data,
  originalDoc,
  req,
}) => {
  if (!data) return data

  const dayId = toRelationId(data.day ?? originalDoc?.day)
  const startTime =
    typeof data.startTime === 'string'
      ? data.startTime
      : typeof originalDoc?.startTime === 'string'
        ? originalDoc.startTime
        : null
  const endTime =
    typeof data.endTime === 'string'
      ? data.endTime
      : typeof originalDoc?.endTime === 'string'
        ? originalDoc.endTime
        : null

  if (dayId == null || (!startTime && !endTime)) return data

  const day = await req.payload.findByID({
    collection: 'conference-days',
    id: dayId,
    depth: 0,
    draft: true,
    overrideAccess: true,
    req,
    select: { startTime: true, endTime: true },
  })

  if (typeof day.startTime !== 'string' || typeof day.endTime !== 'string') return data

  const dayStart = minutesUtc(day.startTime)
  const dayEnd = minutesUtc(day.endTime)
  const errors: { message: string; path: string }[] = []

  if (startTime && !isTimeWithinWindow(minutesUtc(startTime), dayStart, dayEnd)) {
    errors.push({
      message: 'Start time must fall within the selected conference day’s hours.',
      path: 'startTime',
    })
  }

  if (endTime && !isTimeWithinWindow(minutesUtc(endTime), dayStart, dayEnd)) {
    errors.push({
      message: 'End time must fall within the selected conference day’s hours.',
      path: 'endTime',
    })
  }

  if (errors.length > 0) {
    throw new ValidationError({
      collection: 'agenda-items',
      errors,
      req,
    })
  }

  return data
}

/** Parent must be another item on the same day (not self). */
const sameDayParentFilter: FilterOptions = ({ id, data }) => {
  const dayId = toRelationId(data?.day)
  const conditions: Where[] = []

  if (dayId != null) {
    conditions.push({ day: { equals: dayId } })
  }

  if (id != null) {
    conditions.push({ id: { not_equals: id } })
  }

  if (conditions.length === 0) return true

  return { and: conditions }
}

const timeFieldAdmin = {
  width: '50%',
  components: {
    Field: '@/collections/AgendaItems/AgendaTimeField#AgendaTimeField',
  },
  date: {
    pickerAppearance: 'timeOnly' as const,
    displayFormat: 'HH:mm',
    timeFormat: 'HH:mm',
    timeIntervals: 5,
  },
}

export const AgendaItems: CollectionConfig<'agenda-items'> = {
  slug: 'agenda-items',
  labels: {
    singular: 'Voce di programma',
    plural: 'Voci di programma',
  },
  orderable: true,
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    hidden: true,
    group: 'Conferenze',
    useAsTitle: 'title',
    defaultColumns: ['title', 'day', 'startTime', 'endTime', 'isKeynote', 'updatedAt'],
  },
  defaultSort: '_order',
  defaultPopulate: {
    title: true,
    startTime: true,
    endTime: true,
    isKeynote: true,
  },
  fields: [
    {
      name: 'name',
      type: 'richText',
      required: true,
      editor: basicLexical,
      label: 'Title',
      admin: {
        description: 'Titolo formattato della sessione. Title in testo semplice si ricava da questo.',
      },
      validate: (value) => {
        if (!value) return 'Title è obbligatorio.'
        const plaintext = toPlainTitle(value as LexicalJSON)
        if (!plaintext) return 'Title deve contenere del testo.'
        return true
      },
    },
    {
      name: 'day',
      type: 'relationship',
      relationTo: 'conference-days',
      required: true,
      index: true,
      admin: {
        description:
          'Selezionate prima il giorno. Start time e End time restano nei limiti orari di quel giorno.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startTime',
          type: 'date',
          label: 'Start time',
          admin: {
            ...timeFieldAdmin,
            condition: (data) => Boolean(data?.day),
          },
        },
        {
          name: 'endTime',
          type: 'date',
          label: 'End time',
          admin: {
            ...timeFieldAdmin,
            condition: (data) => Boolean(data?.day),
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'duration',
          type: 'ui',
          admin: {
            width: '50%',
            components: {
              Field: '@/collections/AgendaItems/DurationField#DurationField',
            },
          },
        },
        {
          name: 'isKeynote',
          type: 'checkbox',
          label: 'Keynote',
          defaultValue: false,
          admin: {
            width: '50%',
            description: 'Evidenzia graficamente questa sessione sul sito.',
          },
        },
      ],
    },
    // API-only computed duration (minutes). Admin uses the UI field above for live preview.
    {
      name: 'durationMinutes',
      type: 'number',
      virtual: true,
      admin: {
        hidden: true,
      },
      hooks: {
        afterRead: [
          ({ siblingData }) => {
            const start = siblingData?.startTime
            const end = siblingData?.endTime
            if (typeof start !== 'string' || typeof end !== 'string') return null
            return durationMinutes(start, end)
          },
        ],
      },
    },
    iconField({
      name: 'icon',
      label: 'Icon',
      required: false,
      admin: {
        description: 'Icona Lucide facoltativa. La ricerca filtra l’elenco; scorrete per vederle tutte.',
      },
    }),
    {
      name: 'description',
      type: 'richText',
      editor: basicLexical,
      label: 'Description',
      admin: {
        description: 'Note o dettagli facoltativi sulla sessione.',
      },
    },
    {
      name: 'children',
      type: 'join',
      collection: 'agenda-items',
      on: 'parent',
      label: 'Child items',
      orderable: true,
      defaultSort: '_agenda-items_children_order',
      admin: {
        defaultColumns: ['title', 'startTime', 'endTime', 'isKeynote', '_status'],
        description: 'Interventi o sotto-sessioni. Trascinate per l’ordine dentro questa voce.',
      },
    },
    {
      name: 'childAbstracts',
      type: 'join',
      collection: 'abstracts',
      on: 'agendaItems',
      label: 'Abstracts',
      orderable: true,
      defaultSort: '_abstracts_childAbstracts_order',
      admin: {
        defaultColumns: ['plainTitle', 'code', 'status', '_status'],
        description:
          'Abstract scientifici sotto questa sessione. Lo stesso abstract può comparire anche in altre voci.',
      },
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Title in testo semplice ricavato da Title (elenchi).',
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'agenda-items',
      index: true,
      filterOptions: sameDayParentFilter,
      admin: {
        position: 'sidebar',
        description:
          'Voce genitore facoltativa (stesso giorno). Lasciate vuoto per le sessioni di primo livello.',
      },
    },
  ],
  hooks: {
    beforeValidate: [inheritDayFromParent, populateTitleFromName, ensureTimesWithinDay],
    afterChange: [revalidateEditionByDay],
    afterDelete: [revalidateEditionByDayDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 25,
  },
}
