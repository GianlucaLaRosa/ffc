import type { Block } from 'payload'

import { columnSizeField } from '@/fields/columnSize'

export const IntroSeparatorBlock: Block = {
  slug: 'separator',
  interfaceName: 'IntroSeparatorBlock',
  labels: {
    singular: 'Separator',
    plural: 'Separators',
  },
  fields: [
    columnSizeField(),
    {
      name: 'style',
      type: 'select',
      required: true,
      defaultValue: 'line',
      label: 'Style',
      options: [
        { label: 'Line', value: 'line' },
        { label: 'Space', value: 'space' },
      ],
    },
  ],
}
