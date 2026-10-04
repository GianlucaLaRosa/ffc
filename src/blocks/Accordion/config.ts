import type { Block } from 'payload'

import { columnSizeField } from '@/fields/columnSize'
import { flexibleLexical } from '@/fields/flexibleLexical'

export const IntroAccordionBlock: Block = {
  slug: 'accordion',
  interfaceName: 'IntroAccordionBlock',
  labels: {
    singular: 'Accordion',
    plural: 'Accordions',
  },
  fields: [
    columnSizeField(),
    {
      name: 'items',
      type: 'array',
      minRows: 0,
      label: 'Items',
      labels: {
        singular: 'Item',
        plural: 'Items',
      },
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/blocks/Accordion/ItemRowLabel#AccordionItemRowLabel',
        },
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Title',
        },
        {
          name: 'content',
          type: 'richText',
          editor: flexibleLexical,
          label: 'Content',
        },
        {
          name: 'defaultOpen',
          type: 'checkbox',
          defaultValue: false,
          label: 'Open by default',
        },
      ],
    },
  ],
}
