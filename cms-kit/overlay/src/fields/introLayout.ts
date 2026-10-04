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
  'Add Content (one or more text columns with a width, like Pages in the Payload website template), accordions, callouts, buttons, quotes, and separators. Non-Content blocks also have a width. Widths add up on a 12-column row from the large breakpoint up (Full = 12, Two thirds = 8, Half = 6, One third = 4) and wrap. On smaller screens everything is full width and stacks in order.'

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
