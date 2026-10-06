import type { Block, FilterOptions } from 'payload'

import { appendixTabIconField } from '../fields/tabIcon'
import { basicLexical } from '@/fields/basicLexical'
import { copy } from '@/i18n/copy'
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
    appendixTabIconField(),
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
        description: copy(
          'All institutions except those of non–team-member authors on this conference’s abstracts. The public list is ordered Italy first (regions A–Z), then other countries A–Z.',
          'Tutti gli enti tranne quelli degli autori che non sono team member negli abstract di questa conferenza. L’elenco pubblico è ordinato: Italy prima (regioni A–Z), poi gli altri paesi A–Z.',
        ),
      },
    },
  ],
}
