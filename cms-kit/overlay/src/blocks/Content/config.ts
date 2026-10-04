import type { Block } from 'payload'

import { columnSizeField } from '@/fields/columnSize'
import { flexibleLexical } from '@/fields/flexibleLexical'

export const IntroContentBlock: Block = {
  slug: 'content',
  interfaceName: 'IntroContentBlock',
  labels: {
    singular: 'Content',
    plural: 'Content',
  },
  fields: [
    {
      name: 'columns',
      type: 'array',
      minRows: 1,
      label: 'Columns',
      labels: {
        singular: 'Column',
        plural: 'Columns',
      },
      admin: {
        initCollapsed: true,
        description:
          'Widths add up on a 12-column row from the large breakpoint up (Full = 12, Two thirds = 8, Half = 6, One third = 4) and wrap. On smaller screens every column is full width.',
        components: {
          RowLabel: '@/blocks/Content/ColumnRowLabel#ContentColumnRowLabel',
        },
      },
      fields: [
        columnSizeField(),
        {
          name: 'content',
          type: 'richText',
          editor: flexibleLexical,
          label: 'Content',
        },
      ],
    },
  ],
}
