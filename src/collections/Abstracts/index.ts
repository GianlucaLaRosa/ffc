import type {
  CollectionBeforeValidateHook,
  CollectionConfig,
  PayloadRequest,
} from 'payload'
import { ValidationError } from 'payload'
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { basicLexical } from '../../fields/basicLexical'
import { ABSTRACT_PICTURES_FOLDER_NAME } from '@/utilities/mediaFolder'
import { mediaFolderUploadAdmin } from '@/fields/mediaFolderUpload'
import { assignPictureToFolder } from './hooks/assignPictureToFolder'
import { seedDefaultContent } from './hooks/seedDefaultContent'
import { syncAppendices } from './hooks/syncAppendices'

type LexicalJSON = Parameters<typeof convertLexicalToPlaintext>[0]['data']

const toRelationId = (value: unknown): number | string | null => {
  if (value == null) return null
  if (typeof value === 'object' && value !== null && 'id' in value) {
    return (value as { id: number | string }).id
  }
  if (typeof value === 'number' || typeof value === 'string') return value
  return null
}

const toRelationIds = (value: unknown): Array<number | string> => {
  if (!Array.isArray(value)) return []
  return value.map(toRelationId).filter((id): id is number | string => id != null)
}

const toPlainTitle = (title: LexicalJSON): string =>
  convertLexicalToPlaintext({ data: title }).replace(/\s+/g, ' ').trim()

const populatePlainTitle: CollectionBeforeValidateHook = ({ data }) => {
  if (!data?.title) return data

  const plaintext = toPlainTitle(data.title as LexicalJSON)
  if (plaintext) {
    data.plainTitle = plaintext
  }

  return data
}

const conferenceIdFromAgendaItems = async ({
  agendaItemIds,
  req,
}: {
  agendaItemIds: Array<number | string>
  req: PayloadRequest
}): Promise<number | string | null> => {
  if (agendaItemIds.length === 0) return null

  const { docs: agendaItems } = await req.payload.find({
    collection: 'agenda-items',
    depth: 0,
    draft: true,
    limit: agendaItemIds.length,
    overrideAccess: true,
    pagination: false,
    req,
    select: { day: true },
    where: {
      id: {
        in: agendaItemIds,
      },
    },
  })

  if (agendaItems.length !== agendaItemIds.length) return null

  const dayIds = [
    ...new Set(
      agendaItems
        .map((item) => toRelationId(item.day))
        .filter((id): id is number | string => id != null),
    ),
  ]

  if (dayIds.length === 0) return null

  const { docs: days } = await req.payload.find({
    collection: 'conference-days',
    depth: 0,
    draft: true,
    limit: dayIds.length,
    overrideAccess: true,
    pagination: false,
    req,
    select: { conference: true },
    where: {
      id: {
        in: dayIds,
      },
    },
  })

  const conferenceIds = [
    ...new Set(
      days
        .map((day) => toRelationId(day.conference))
        .filter((id): id is number | string => id != null),
    ),
  ]

  if (conferenceIds.length !== 1) return null
  return conferenceIds[0] ?? null
}

/** When created from an agenda item, inherit the conference edition from linked sessions. */
const inheritConferenceFromAgendaItems: CollectionBeforeValidateHook = async ({
  data,
  originalDoc,
  req,
}) => {
  if (!data) return data
  if (toRelationId(data.conference ?? originalDoc?.conference) != null) return data

  const agendaItemIds = toRelationIds(
    data.agendaItems !== undefined ? data.agendaItems : originalDoc?.agendaItems,
  )
  const conferenceId = await conferenceIdFromAgendaItems({ agendaItemIds, req })
  if (conferenceId != null) {
    data.conference = conferenceId
  }

  return data
}

/** Linked agenda items must belong to the same conference edition. */
const ensureAgendaItemsMatchConference: CollectionBeforeValidateHook = async ({
  data,
  originalDoc,
  req,
}) => {
  if (!data) return data

  const conferenceId = toRelationId(data.conference ?? originalDoc?.conference)
  const agendaItemIds = toRelationIds(
    data.agendaItems !== undefined ? data.agendaItems : originalDoc?.agendaItems,
  )

  if (agendaItemIds.length === 0) return data

  if (conferenceId == null) {
    throw new ValidationError({
      collection: 'abstracts',
      errors: [
        {
          message: 'Conference is required when linking agenda items.',
          path: 'conference',
        },
      ],
      req,
    })
  }

  const derivedConferenceId = await conferenceIdFromAgendaItems({ agendaItemIds, req })

  if (
    derivedConferenceId == null ||
    String(derivedConferenceId) !== String(conferenceId)
  ) {
    throw new ValidationError({
      collection: 'abstracts',
      errors: [
        {
          message: 'Agenda items must belong to the same conference edition as this abstract.',
          path: 'agendaItems',
        },
      ],
      req,
    })
  }

  return data
}

export const Abstracts: CollectionConfig<'abstracts'> = {
  slug: 'abstracts',
  orderable: true,
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    hidden: true,
    group: 'Conferences',
    useAsTitle: 'plainTitle',
    defaultColumns: ['plainTitle', 'conference', 'agendaItems', 'code', 'updatedAt'],
    description:
      'Scientific abstracts for one conference edition. Prefer creating and ordering them from the conference Abstracts tab.',
  },
  defaultSort: '_order',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Overview',
          fields: [
            {
              name: 'title',
              type: 'richText',
              required: true,
              editor: basicLexical,
              label: 'Title',
              validate: (value) => {
                if (!value) return 'Title is required.'
                const plaintext = toPlainTitle(value as LexicalJSON)
                if (!plaintext) return 'Title must include text.'
                return true
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'code',
                  type: 'text',
                  label: 'Code',
                  admin: {
                    width: '50%',
                    description:
                      'Research or session code (e.g. "CF crio"). Not required to be unique.',
                  },
                },
                {
                  name: 'status',
                  type: 'relationship',
                  relationTo: 'abstract-statuses',
                  label: 'Status',
                  admin: {
                    width: '50%',
                    description:
                      'When selected and Content is empty, default sections are created for this status.',
                    components: {
                      Field: '@/collections/Abstracts/AbstractStatusField#AbstractStatusField',
                    },
                  },
                },
              ],
            },
            {
              name: 'relatedCodes',
              type: 'array',
              label: 'Related codes',
              labels: {
                singular: 'Related code',
                plural: 'Related codes',
              },
              admin: {
                description:
                  'Additional code/status pairs for this abstract. Each row adds a matching appendix after the primary one (same order).',
                components: {
                  Field: '@/collections/Abstracts/RelatedCodesField#RelatedCodesField',
                  RowLabel: '@/collections/Abstracts/RelatedCodeRowLabel#RelatedCodeRowLabel',
                },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'code',
                      type: 'text',
                      label: 'Code',
                      admin: {
                        width: '50%',
                      },
                    },
                    {
                      name: 'status',
                      type: 'relationship',
                      relationTo: 'abstract-statuses',
                      label: 'Status',
                      admin: {
                        width: '50%',
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: 'content',
              type: 'array',
              label: 'Content',
              labels: {
                singular: 'Section',
                plural: 'Sections',
              },
              admin: {
                description:
                  'Structured abstract sections. Defaults are seeded when Status is selected and this list is empty.',
                components: {
                  RowLabel: '@/collections/Abstracts/ContentRowLabel#ContentRowLabel',
                },
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  label: 'Title',
                },
                {
                  name: 'description',
                  type: 'richText',
                  editor: basicLexical,
                  label: 'Description',
                },
              ],
            },
          ],
        },
        {
          label: 'Appendix',
          fields: [
            {
              name: 'appendices',
              type: 'array',
              label: 'Appendices',
              labels: {
                singular: 'Appendix',
                plural: 'Appendices',
              },
              minRows: 1,
              admin: {
                description:
                  'First row is the primary code/status appendix; following rows match Related codes in order. Row count is kept at 1 + Related codes automatically.',
                components: {
                  Field: '@/collections/Abstracts/AppendicesField#AppendicesField',
                  RowLabel: '@/collections/Abstracts/AppendixRowLabel#AppendixRowLabel',
                },
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Title',
                },
                {
                  name: 'body',
                  type: 'richText',
                  editor: basicLexical,
                  label: 'Body',
                },
              ],
            },
          ],
        },
        {
          label: 'Authors & pictures',
          fields: [
            {
              name: 'authors',
              type: 'array',
              label: 'Authors / Speakers',
              labels: {
                singular: 'Author',
                plural: 'Authors',
              },
              admin: {
                description:
                  'Ordered authors and speakers (same list). Drag rows to set order; assign a role per author and mark speakers with the checkbox. Each person can only appear once.',
              },
              validate: (value) => {
                if (!Array.isArray(value)) return true
                const ids = value
                  .map((row) => toRelationId((row as { person?: unknown })?.person))
                  .filter((id): id is number | string => id != null)
                if (new Set(ids.map(String)).size !== ids.length) {
                  return 'Each person can only appear once as an author on this abstract.'
                }
                return true
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'person',
                      type: 'relationship',
                      relationTo: 'people',
                      required: true,
                      label: 'Person',
                      filterOptions: ({ data, siblingData }) => {
                        const authors = Array.isArray(data?.authors) ? data.authors : []
                        const currentId = toRelationId(
                          (siblingData as { person?: unknown } | undefined)?.person,
                        )
                        const selectedIds = authors
                          .map((row: { person?: unknown }) => toRelationId(row?.person))
                          .filter((id: number | string | null): id is number | string =>
                            id != null && String(id) !== String(currentId),
                          )
                        if (selectedIds.length === 0) return true
                        return { id: { not_in: selectedIds } }
                      },
                      admin: { width: '45%' },
                    },
                    {
                      name: 'role',
                      type: 'select',
                      required: true,
                      label: 'Role',
                      options: [
                        { label: 'Primary Investigator', value: 'primaryInvestigator' },
                        { label: 'Partner', value: 'partner' },
                        { label: 'Collaborator', value: 'collaborator' },
                        { label: 'Team Member', value: 'teamMember' },
                      ],
                      admin: { width: '35%' },
                    },
                    {
                      name: 'isSpeaker',
                      type: 'checkbox',
                      label: 'Speaker',
                      defaultValue: false,
                      admin: { width: '20%' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'picture',
              type: 'array',
              label: 'Pictures',
              labels: {
                singular: 'Picture',
                plural: 'Pictures',
              },
              admin: {
                description: `Ordered images for this abstract. Stored in the Media folder "${ABSTRACT_PICTURES_FOLDER_NAME}".`,
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  label: 'Image',
                  admin: mediaFolderUploadAdmin(ABSTRACT_PICTURES_FOLDER_NAME),
                },
                {
                  name: 'description',
                  type: 'text',
                  required: true,
                  label: 'Description',
                },
              ],
            },
          ],
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
        description:
          'Conference edition this abstract belongs to. Set automatically when created from a conference.',
      },
    },
    {
      name: 'agendaItems',
      type: 'relationship',
      relationTo: 'agenda-items',
      hasMany: true,
      index: true,
      label: 'Agenda items',
      admin: {
        position: 'sidebar',
        description:
          'Parent agenda items for this abstract. Must belong to the same conference edition. An abstract can appear under multiple sessions.',
        isSortable: true,
      },
    },
    {
      name: 'plainTitle',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Auto-generated plain-text title from Title (used in lists).',
      },
    },
    {
      name: 'note',
      type: 'textarea',
      label: 'Note',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      populatePlainTitle,
      inheritConferenceFromAgendaItems,
      ensureAgendaItemsMatchConference,
      seedDefaultContent,
      syncAppendices,
    ],
    afterChange: [assignPictureToFolder],
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
