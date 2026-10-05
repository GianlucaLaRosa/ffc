import type { BlocksField } from 'payload'

import { IntroAccordionBlock } from '@/blocks/Accordion/config'
import { IntroCalloutBlock } from '@/blocks/Callout/config'
import { IntroContentBlock } from '@/blocks/Content/config'
import { IntroCtaBlock } from '@/blocks/Cta/config'
import { IntroQuoteBlock } from '@/blocks/Quote/config'
import { IntroSeparatorBlock } from '@/blocks/Separator/config'

const LAYOUT_BLOCKS = [
  IntroContentBlock,
  IntroAccordionBlock,
  IntroCalloutBlock,
  IntroCtaBlock,
  IntroQuoteBlock,
  IntroSeparatorBlock,
]

export const LAYOUT_BLOCKS_ADMIN_DESCRIPTION =
  'Aggiungete Content (una o più colonne di testo con una Width, come nelle Pages del template Payload), accordion, callout, pulsanti, citazioni e separatori. I blocchi diversi da Content hanno anch’essi una Width. Le larghezze si sommano su una riga a 12 colonne dal breakpoint grande in su (Full = 12, Two thirds = 8, Half = 6, One third = 4) e vanno a capo. Sugli schermi piccoli tutto è a larghezza piena e si impila in ordine.'

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
