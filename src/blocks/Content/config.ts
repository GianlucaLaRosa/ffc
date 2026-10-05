import type { Block } from 'payload'

import { columnSizeField } from '@/fields/columnSize'
import { flexibleLexical } from '@/fields/flexibleLexical'
import { copy } from '@/i18n/copy'

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
        description: copy(
          'Widths add up on a 12-column row from the large breakpoint up (Full = 12, Two thirds = 8, Half = 6, One third = 4) and wrap. On small screens each column is full width.',
          'Le Width si sommano su una riga a 12 colonne dal breakpoint grande in su (Full = 12, Two thirds = 8, Half = 6, One third = 4) e vanno a capo. Sugli schermi piccoli ogni colonna è a larghezza piena.',
        ),
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
