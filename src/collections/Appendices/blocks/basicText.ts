import type { Block } from 'payload'

import { basicLexical } from '@/fields/basicLexical'

export const BasicTextAppendixBlock: Block = {
  slug: 'basicText',
  interfaceName: 'BasicTextAppendixBlock',
  labels: {
    singular: 'Basic text',
    plural: 'Basic text',
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
