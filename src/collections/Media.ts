import type { CollectionConfig } from 'payload'
import { limitedRichTextEditor } from '../fields/lexicalEditors'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'caption', 'updatedAt'],
    group: 'Media & Assets',
  },
  access: {
    read: () => true,
  },
  upload: {
    staticDir: 'media',
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 512,
        position: 'centre',
      },
      {
        name: 'full',
        width: 1920,
        height: 1080,
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text (Accessibility)',
      required: false,
    },
    {
      name: 'caption',
      type: 'richText',
      editor: limitedRichTextEditor,
      label: 'Caption (Bold, Italic, Underline, Sub/Superscript, Strikethrough)',
    },
    {
      name: 'abstract',
      type: 'relationship',
      relationTo: 'abstracts',
      label: 'Linked Abstract',
    },
    {
      name: 'taggedPeople',
      type: 'relationship',
      relationTo: 'people',
      hasMany: true,
      label: 'Tagged People / Researchers',
    },
    {
      name: 'cropFocus',
      type: 'select',
      label: 'Crop Focus Point',
      defaultValue: 'center',
      options: [
        { label: 'Center', value: 'center' },
        { label: 'Top', value: 'top' },
        { label: 'Bottom', value: 'bottom' },
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
    },
  ],
}
