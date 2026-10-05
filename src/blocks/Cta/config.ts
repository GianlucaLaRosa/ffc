import type { Block } from 'payload'

import { columnSizeField } from '@/fields/columnSize'
import { copy } from '@/i18n/copy'

export const IntroCtaBlock: Block = {
  slug: 'cta',
  interfaceName: 'IntroCtaBlock',
  labels: {
    singular: 'Button',
    plural: 'Buttons',
  },
  fields: [
    columnSizeField(),
    {
      name: 'label',
      type: 'text',
      required: true,
      label: 'Label',
    },
    {
      name: 'destination',
      type: 'select',
      required: true,
      defaultValue: 'programme',
      label: 'Goes to',
      options: [
        { label: 'Programme section', value: 'programme' },
        { label: 'Venue section', value: 'venue' },
        { label: 'Abstracts & appendix', value: 'appendix' },
        { label: 'Custom URL', value: 'custom' },
      ],
    },
    {
      name: 'url',
      type: 'text',
      label: 'URL',
      admin: {
        condition: (_, siblingData) => siblingData?.destination === 'custom',
        description: copy(
          'External site, or a page path such as /archive/…',
          'Sito esterno, o un percorso di pagina come /archive/…',
        ),
      },
      validate: (value: unknown, { siblingData }: { siblingData: unknown }) => {
        const data = siblingData as { destination?: string } | undefined
        if (data?.destination !== 'custom') return true
        const url = typeof value === 'string' ? value.trim() : ''
        if (!url) return 'URL is required.'
        if (/^(javascript|data|vbscript):/i.test(url)) return 'This URL scheme is not allowed.'
        return true
      },
    },
    {
      name: 'newTab',
      type: 'checkbox',
      defaultValue: false,
      label: 'Open in new tab',
      admin: {
        condition: (_, siblingData) => siblingData?.destination === 'custom',
      },
    },
    {
      name: 'appearance',
      type: 'select',
      required: true,
      defaultValue: 'solid',
      label: 'Style',
      options: [
        { label: 'Solid', value: 'solid' },
        { label: 'Outline', value: 'outline' },
      ],
    },
  ],
}
