import type { Block, FilterOptions } from 'payload'

import { basicLexical } from '@/fields/basicLexical'
import {
  collectExcludedInstitutionIds,
  toRelationId,
} from '@/utilities/appendixInstitutions'

const filterOutAbstractAuthorInstitutions: FilterOptions = async ({ data, req }) => {
  const conferenceId = toRelationId(
    (data as { conference?: unknown } | undefined)?.conference,
  )
  if (conferenceId == null) return true

  const excludedIds = await collectExcludedInstitutionIds({
    conferenceId,
    req,
  })

  if (excludedIds.length === 0) return true

  return {
    id: {
      not_in: excludedIds,
    },
  }
}

export const InstitutionsAppendixBlock: Block = {
  slug: 'institutions',
  interfaceName: 'InstitutionsAppendixBlock',
  labels: {
    singular: 'Institutions list',
    plural: 'Institutions lists',
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
    {
      name: 'institutions',
      type: 'relationship',
      relationTo: 'institutions',
      hasMany: true,
      label: 'Institutions',
      filterOptions: filterOutAbstractAuthorInstitutions,
      admin: {
        allowCreate: true,
        isSortable: true,
        description:
          'All institutions except those of non–team-member authors on this conference’s abstracts. Create new ones here if needed. Drag to set display order.',
      },
    },
  ],
}
