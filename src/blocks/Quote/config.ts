import type { Block } from 'payload'

import { columnSizeField } from '@/fields/columnSize'
import { copy } from '@/i18n/copy'

export const IntroQuoteBlock: Block = {
  slug: 'quote',
  interfaceName: 'IntroQuoteBlock',
  labels: {
    singular: 'Quote',
    plural: 'Quotes',
  },
  fields: [
    columnSizeField(),
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      label: 'Quote',
    },
    {
      name: 'attribution',
      type: 'text',
      label: 'Attribution',
      admin: {
        description: copy(
          'Speaker, role, or source, optional.',
          'Relatore, ruolo o fonte, facoltativo.',
        ),
      },
    },
  ],
}
