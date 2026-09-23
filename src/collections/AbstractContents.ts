import type { CollectionConfig } from 'payload'
import { fullRichTextEditor } from '../fields/lexicalEditors'

export const AbstractContents: CollectionConfig = {
  slug: 'abstract-contents',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'createdAt'],
    group: 'Scientific Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title (e.g. Background, Methods, Results, Conclusion)',
    },
    {
      name: 'description',
      type: 'richText',
      editor: fullRichTextEditor,
      required: true,
      label: 'Content (Full Rich Text with tables, media, and formatting)',
    },
  ],
}
