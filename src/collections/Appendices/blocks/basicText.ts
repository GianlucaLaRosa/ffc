import type { Block } from 'payload'

import { appendixTabIconField } from '../fields/tabIcon'
import { layoutBlocksField } from '@/fields/introLayout'

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
      admin: {
        description: 'Etichetta della linguetta nell’appendice pubblica.',
      },
    },
    appendixTabIconField(),
    layoutBlocksField({ name: 'layout', label: 'Layout' }),
  ],
}
