import type { CollectionBeforeValidateHook, CollectionConfig } from 'payload'
import { ValidationError } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import {
  revalidateEditionByConference,
  revalidateEditionByConferenceDelete,
} from '@/utilities/revalidatePublicCache'

const toRelationId = (value: unknown): number | string | null => {
  if (value == null) return null
  if (typeof value === 'object' && value !== null && 'id' in value) {
    return (value as { id: number | string }).id
  }
  if (typeof value === 'number' || typeof value === 'string') return value
  return null
}

/** Calendar day bounds in UTC for uniqueness checks (no timezone conversion for display). */
const dayBoundsUtc = (value: string): { start: string; end: string } | null => {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null

  const start = new Date(
    Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate(), 0, 0, 0, 0),
  )
  const end = new Date(
    Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate(), 23, 59, 59, 999),
  )

  return { start: start.toISOString(), end: end.toISOString() }
}

const ensureUniqueDatePerConference: CollectionBeforeValidateHook = async ({
  data,
  originalDoc,
  req,
}) => {
  if (!data) return data

  const conferenceId = toRelationId(data.conference ?? originalDoc?.conference)
  const dateValue =
    typeof data.date === 'string'
      ? data.date
      : typeof originalDoc?.date === 'string'
        ? originalDoc.date
        : null

  if (conferenceId == null || !dateValue) return data

  const bounds = dayBoundsUtc(dateValue)
  if (!bounds) return data

  const currentId = originalDoc?.id

  const { docs } = await req.payload.find({
    collection: 'conference-days',
    depth: 0,
    draft: true,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    req,
    where: {
      and: [
        { conference: { equals: conferenceId } },
        { date: { greater_than_equal: bounds.start } },
        { date: { less_than_equal: bounds.end } },
        ...(currentId != null ? [{ id: { not_equals: currentId } }] : []),
      ],
    },
  })

  if (docs.length > 0) {
    throw new ValidationError({
      collection: 'conference-days',
      errors: [
        {
          message: 'This conference already has a day on this date.',
          path: 'date',
        },
      ],
      req,
    })
  }

  return data
}

export const ConferenceDays: CollectionConfig<'conference-days'> = {
  slug: 'conference-days',
  labels: {
    singular: 'Conference day',
    plural: 'Conference days',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    hidden: true,
    group: 'Conferences',
    useAsTitle: 'date',
    defaultColumns: ['conference', 'date', 'startTime', 'endTime', 'updatedAt'],
  },
  defaultSort: 'date',
  defaultPopulate: {
    date: true,
    startTime: true,
    endTime: true,
  },
  fields: [
    {
      name: 'date',
      type: 'date',
      required: true,
      index: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd MMM yyyy',
        },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startTime',
          type: 'date',
          required: true,
          label: 'Start time',
          admin: {
            width: '50%',
            date: {
              pickerAppearance: 'timeOnly',
              displayFormat: 'HH:mm',
              timeFormat: 'HH:mm',
              timeIntervals: 15,
            },
          },
        },
        {
          name: 'endTime',
          type: 'date',
          required: true,
          label: 'End time',
          admin: {
            width: '50%',
            description: 'May be earlier than start time for overnight days.',
            date: {
              pickerAppearance: 'timeOnly',
              displayFormat: 'HH:mm',
              timeFormat: 'HH:mm',
              timeIntervals: 15,
            },
          },
        },
      ],
    },
    {
      name: 'agendaItems',
      type: 'join',
      collection: 'agenda-items',
      on: 'day',
      label: 'Agenda items',
      orderable: true,
      defaultSort: '_agenda-items_agendaItems_order',
      where: {
        parent: {
          exists: false,
        },
      },
      admin: {
        defaultColumns: ['title', 'startTime', 'endTime', 'isKeynote', '_status'],
        description:
          'Top-level sessions for this day. Nested items are managed on each parent. Drag to reorder.',
      },
    },
    {
      name: 'conference',
      type: 'relationship',
      relationTo: 'conferences',
      required: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Parent conference. Set automatically when created from a conference.',
      },
    },
  ],
  hooks: {
    beforeValidate: [ensureUniqueDatePerConference],
    afterChange: [revalidateEditionByConference],
    afterDelete: [revalidateEditionByConferenceDelete],
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
