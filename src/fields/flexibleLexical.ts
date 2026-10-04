import {
  BlocksFeature,
  defaultColors,
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  TextStateFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { MediaBlock } from '@/blocks/MediaBlock/config'

/**
 * Full Lexical editor for long-form / page-intro content.
 * Starts from Payload's recommended defaultFeatures (headings, lists,
 * checklist, align, indent, blockquote, links, relationships, uploads,
 * inline code, horizontal rules, toolbars) and adds tables, MediaBlock,
 * fixed toolbar, and text colors.
 */
export const flexibleLexical = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    FixedToolbarFeature(),
    BlocksFeature({ blocks: [MediaBlock] }),
    EXPERIMENTAL_TableFeature(),
    TextStateFeature({
      state: {
        color: {
          ...defaultColors.background,
          ...defaultColors.text,
        },
      },
    }),
  ],
})
