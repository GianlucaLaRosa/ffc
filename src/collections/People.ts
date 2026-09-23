import type { CollectionConfig } from 'payload'
import { limitedWithLinkRichTextEditor } from '../fields/lexicalEditors'

export const People: CollectionConfig = {
  slug: 'people',
  admin: {
    useAsTitle: 'lastName',
    defaultColumns: ['lastName', 'firstName', 'institution'],
    group: 'Conference',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          required: true,
          label: 'First Name',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
          label: 'Last Name',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'institution',
      type: 'relationship',
      relationTo: 'institutions',
      label: 'Affiliated Institution',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Profile Photo',
    },
    {
      name: 'bio',
      type: 'richText',
      editor: limitedWithLinkRichTextEditor,
      label: 'Biography',
    },
  ],
}
