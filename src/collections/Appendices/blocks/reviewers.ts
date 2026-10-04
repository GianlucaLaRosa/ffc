import type { Block } from 'payload'

import { basicLexical } from '@/fields/basicLexical'

export const ReviewersAppendixBlock: Block = {
  slug: 'reviewers',
  interfaceName: 'ReviewersAppendixBlock',
  labels: {
    singular: 'Reviewers',
    plural: 'Reviewers',
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
