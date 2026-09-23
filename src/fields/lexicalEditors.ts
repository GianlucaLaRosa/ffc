import {
  lexicalEditor,
  ParagraphFeature,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  LinkFeature,
  HeadingFeature,
  OrderedListFeature,
  UnorderedListFeature,
  BlockquoteFeature,
  HorizontalRuleFeature,
  EXPERIMENTAL_TableFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical'

/**
 * Limited Rich Text Editor:
 * Only Bold, Italic, Underline, Strikethrough, Superscript, and Subscript.
 */
export const limitedRichTextEditor = lexicalEditor({
  features: () => [
    ParagraphFeature(),
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    StrikethroughFeature(),
    SubscriptFeature(),
    SuperscriptFeature(),
  ],
})

/**
 * Limited Rich Text Editor with Link support:
 * Bold, Italic, Underline, Strikethrough, Superscript, Subscript, and Link.
 */
export const limitedWithLinkRichTextEditor = lexicalEditor({
  features: () => [
    ParagraphFeature(),
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    StrikethroughFeature(),
    SubscriptFeature(),
    SuperscriptFeature(),
    LinkFeature(),
  ],
})

/**
 * Full Rich Text Editor:
 * Headings, Formatting, Links, Lists, Quotes, Tables, and Uploads.
 */
export const fullRichTextEditor = lexicalEditor({
  features: () => [
    ParagraphFeature(),
    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    StrikethroughFeature(),
    SubscriptFeature(),
    SuperscriptFeature(),
    LinkFeature(),
    OrderedListFeature(),
    UnorderedListFeature(),
    BlockquoteFeature(),
    HorizontalRuleFeature(),
    EXPERIMENTAL_TableFeature(),
    UploadFeature({
      collections: {
        media: {
          fields: [
            {
              name: 'caption',
              type: 'text',
            },
          ],
        },
      },
    }),
  ],
})
