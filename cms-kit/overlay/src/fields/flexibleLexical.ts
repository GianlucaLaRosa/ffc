import {
  BlocksFeature,
  defaultColors,
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  HeadingFeature,
  TextStateFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { MediaBlock } from '@/blocks/MediaBlock/config'

/**
 * Full Lexical editor for long-form / page-intro content.
 * Starts from Payload's recommended defaultFeatures (headings, lists,
 * align, indent, blockquote, links, relationships, uploads, inline code,
 * horizontal rules, toolbars), without checklists, and adds tables,
 * MediaBlock, fixed toolbar, and text colors.
 * Headings are h3–h6 so the page h1 (conference name) stays unique.
 */
export const flexibleLexical = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures.filter(
      (feature) => feature.key !== 'checklist' && feature.key !== 'heading',
    ),
    HeadingFeature({ enabledHeadingSizes: ['h3', 'h4', 'h5', 'h6'] }),
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
