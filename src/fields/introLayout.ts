import type { BlocksField } from 'payload'

import { IntroAccordionBlock } from '@/blocks/Accordion/config'
import { IntroCalloutBlock } from '@/blocks/Callout/config'
import { IntroContentBlock } from '@/blocks/Content/config'
import { IntroCtaBlock } from '@/blocks/Cta/config'
import { IntroQuoteBlock } from '@/blocks/Quote/config'
import { IntroSeparatorBlock } from '@/blocks/Separator/config'
import { copy } from '@/i18n/copy'

const LAYOUT_BLOCKS = [
  IntroContentBlock,
  IntroAccordionBlock,
  IntroCalloutBlock,
  IntroCtaBlock,
  IntroQuoteBlock,
  IntroSeparatorBlock,
]

export const LAYOUT_BLOCKS_ADMIN_DESCRIPTION = copy(
  'Add Content (one or more text columns with a Width, as in the Payload Pages template), accordion, callout, buttons, quotes, and separators. Blocks other than Content also have a Width. Widths add up on a 12-column row from the large breakpoint up (Full = 12, Two thirds = 8, Half = 6, One third = 4) and wrap. On small screens everything is full width and stacks in order.',
  'Aggiungete Content (una o più colonne di testo con una Width, come nelle Pages del template Payload), accordion, callout, pulsanti, citazioni e separatori. I blocchi diversi da Content hanno anch’essi una Width. Le larghezze si sommano su una riga a 12 colonne dal breakpoint grande in su (Full = 12, Two thirds = 8, Half = 6, One third = 4) e vanno a capo. Sugli schermi piccoli tutto è a larghezza piena e si impila in ordine.',
)

export const layoutBlocksField = ({
  name,
  label,
}: {
  name: string
  label: string
}): BlocksField => ({
  name,
  type: 'blocks',
  label,
  labels: {
    singular: 'Block',
    plural: 'Blocks',
  },
  blocks: LAYOUT_BLOCKS,
  admin: {
    description: LAYOUT_BLOCKS_ADMIN_DESCRIPTION,
  },
})

export const introLayoutField = (): BlocksField =>
  layoutBlocksField({ name: 'intro', label: 'Page intro' })
