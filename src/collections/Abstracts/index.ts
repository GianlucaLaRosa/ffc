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
import {
  revalidateEditionByConference,
  revalidateEditionByConferenceDelete,
} from '@/utilities/revalidatePublicCache'
import { adminGroups, copy } from '@/i18n/copy'
import { asT } from '@/i18n/asT'

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
  labels: {
    singular: 'Abstract',
    plural: 'Abstract',
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
    group: adminGroups.conferences,
    useAsTitle: 'plainTitle',
    defaultColumns: ['plainTitle', 'conference', 'agendaItems', 'code', 'updatedAt'],
    description: copy(
      'Scientific abstracts for an edition. Best created and ordered from the conference Abstract tab.',
      'Abstract scientifici di un’edizione. Meglio crearli e ordinarli dal tab Abstract della conferenza.',
    ),
  },
  defaultSort: '_order',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: copy('Overview', 'Panoramica'),
          fields: [
            {
              name: 'title',
              type: 'richText',
              required: true,
              editor: basicLexical,
              label: 'Title',
              validate: (value, { req }) => {
                if (!value) return asT(req.t)('fcr:titleRequired')
                const plaintext = toPlainTitle(value as LexicalJSON)
                if (!plaintext) return asT(req.t)('fcr:titleMustHaveText')
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
                    description: copy(
                      'Research or session code (e.g. “CF crio”). Does not have to be unique.',
                      'Codice di ricerca o sessione (es. «CF crio»). Non deve essere unico.',
                    ),
                  },
                },
                {
                  name: 'status',
                  type: 'relationship',
                  relationTo: 'abstract-statuses',
                  label: 'Status',
                  admin: {
                    width: '50%',
                    description: copy(
                      'If selected and Content is empty, the default sections for this Status are created.',
                      'Se selezionato e Content è vuoto, si creano le sezioni predefinite di questo Status.',
                    ),
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
                description: copy(
                  'Other Code/Status pairs. Each row adds an appendix after the main one (same order).',
                  'Altre coppie Code/Status. Ogni riga aggiunge un’appendice dopo quella principale (stesso ordine).',
                ),
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
                description: copy(
                  'Structured sections. Defaults are created when you select Status and this list is empty.',
                  'Sezioni strutturate. I predefiniti si creano quando selezionate Status e questo elenco è vuoto.',
                ),
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
          label: copy('Appendix', 'Appendice'),
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
                description: copy(
                  'The first row is the appendix for the main Code/Status; the following follow Related codes. The row count stays 1 + Related codes.',
                  'La prima riga è l’appendice del Code/Status principale; le successive seguono Related codes. Il numero di righe resta 1 + Related codes.',
                ),
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
          label: copy('Authors and photos', 'Autori e foto'),
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
                description: copy(
                  'Authors and speakers in order (same list). Drag rows; assign a Role and tick Speaker. Each person can appear only once.',
                  'Autori e relatori in ordine (stesso elenco). Trascinate le righe; assegnate un Role e spuntate Speaker. Ogni persona può comparire una sola volta.',
                ),
              },
              validate: (value, { req }) => {
                if (!Array.isArray(value)) return true
                const ids = value
                  .map((row) => toRelationId((row as { person?: unknown })?.person))
                  .filter((id): id is number | string => id != null)
                if (new Set(ids.map(String)).size !== ids.length) {
                  return asT(req.t)('fcr:uniqueAuthor')
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
                description: copy(
                  `Ordered photos for this abstract (images only). On the public card they appear at the top; a click opens the gallery. Media folder “${ABSTRACT_PICTURES_FOLDER_NAME}”.`,
                  `Foto ordinate di questo abstract (solo immagini). Sulla scheda pubblica comparono in cima; un clic apre la galleria. Cartella Media «${ABSTRACT_PICTURES_FOLDER_NAME}».`,
                ),
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  label: 'Image',
                  filterOptions: {
                    mimeType: { contains: 'image/' },
                  },
                  admin: mediaFolderUploadAdmin(ABSTRACT_PICTURES_FOLDER_NAME),
                },
                {
                  name: 'description',
                  type: 'text',
                  required: true,
                  label: 'Caption',
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
        description: copy(
          'Edition this abstract belongs to. Set automatically if you create it from the conference.',
          'Edizione a cui appartiene questo abstract. Impostata in automatico se lo create dalla conferenza.',
        ),
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
        description: copy(
          'Sessions (Agenda items) of this edition. The same abstract can sit under more than one session.',
          'Sessioni (Agenda items) di questa edizione. Lo stesso abstract può stare sotto più sessioni.',
        ),
        isSortable: true,
      },
    },
    {
      name: 'plainTitle',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: copy(
          'Plain-text Title derived from Title (lists).',
          'Title in testo semplice ricavato da Title (elenchi).',
        ),
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
    afterChange: [assignPictureToFolder, revalidateEditionByConference],
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
