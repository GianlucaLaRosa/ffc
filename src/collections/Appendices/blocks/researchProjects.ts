import type { Block } from 'payload'

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
    {
      name: 'description',
      type: 'richText',
      editor: basicLexical,
      label: 'Description',
    },
  ],
}
