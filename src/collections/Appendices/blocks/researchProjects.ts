import type { Block } from 'payload'

import { appendixTabIconField } from '../fields/tabIcon'
import { basicLexical } from '@/fields/basicLexical'

export const ResearchProjectsAppendixBlock: Block = {
  slug: 'researchProjects',
  interfaceName: 'ResearchProjectsAppendixBlock',
  labels: {
    singular: 'Research projects',
    plural: 'Research projects',
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
  ],
}
