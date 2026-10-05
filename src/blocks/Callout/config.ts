import type { Block } from 'payload'

import { basicLexical } from '@/fields/basicLexical'
import { columnSizeField } from '@/fields/columnSize'
import { copy } from '@/i18n/copy'

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
        description: copy(
          'Use Deadline for dates and deadlines, Important for notices to read.',
          'Usate Deadline per date e scadenze, Important per avvisi da leggere.',
        ),
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
