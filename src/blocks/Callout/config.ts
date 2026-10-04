import type { Block } from 'payload'

import { basicLexical } from '@/fields/basicLexical'
import { columnSizeField } from '@/fields/columnSize'

export const IntroCalloutBlock: Block = {
  slug: 'callout',
  interfaceName: 'IntroCalloutBlock',
  labels: {
    singular: 'Callout',
    plural: 'Callouts',
  },
  fields: [
    columnSizeField(),
    {
      name: 'tone',
      type: 'select',
      required: true,
      defaultValue: 'note',
      label: 'Tone',
      options: [
        { label: 'Note', value: 'note' },
        { label: 'Important', value: 'important' },
        { label: 'Deadline', value: 'deadline' },
      ],
      admin: {
        description: 'Use Deadline for dates and cut-offs, Important for must-read notices.',
      },
    },
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
}
