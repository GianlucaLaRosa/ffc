import type { CollectionConfig } from 'payload'
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { assignFolderOnCreate } from './Media/hooks/assignFolderOnCreate'

export const Media: CollectionConfig = {
  slug: 'media',
  folders: true,
  admin: {
    group: 'Content',
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'caption', 'updatedAt'],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  upload: {
    staticDir: 'media',
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
    focalPoint: true,
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
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
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
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
      label: 'Caption',
    },
    {
      name: 'abstract',
      type: 'join',
      collection: 'abstracts',
      on: 'picture.image',
      label: 'Linked Abstract',
      admin: {
        readOnly: true,
        allowCreate: false,
        defaultColumns: ['plainTitle', 'code', 'conference'],
        description: 'Abstracts that use this image. Edit the link from the abstract, not here.',
      },
    },
    {
      name: 'taggedPeople',
      type: 'join',
      collection: 'people',
      on: 'photo',
      label: 'Tagged People / Researchers',
      admin: {
        readOnly: true,
        allowCreate: false,
        defaultColumns: ['fullName', 'institution'],
        description: 'People whose profile photo is this file. Edit the photo on the person.',
      },
    },
  ],
  hooks: {
    beforeChange: [assignFolderOnCreate],
  },
}
