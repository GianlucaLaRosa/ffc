import type { CollectionBeforeValidateHook, CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { flexibleLexical } from '../../fields/flexibleLexical'
import { mediaFolderUploadAdmin } from '@/fields/mediaFolderUpload'
import { PEOPLE_PHOTOS_FOLDER_NAME } from '@/utilities/mediaFolder'
import { assignPhotoToFolder } from './hooks/assignPhotoToFolder'

const populateFullName: CollectionBeforeValidateHook = ({ data }) => {
  if (!data) return data

  const first =
    typeof data.firstName === 'string' ? data.firstName.trim() : ''
  const last = typeof data.lastName === 'string' ? data.lastName.trim() : ''
  const fullName = [first, last].filter(Boolean).join(' ')

  if (fullName) {
    data.fullName = fullName
  }

  return data
}

export const People: CollectionConfig<'people'> = {
  slug: 'people',
  orderable: true,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'People & orgs',
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'institution', 'updatedAt'],
    description: 'Researchers, authors, speakers, and reviewers.',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          required: true,
          label: 'First name',
          admin: { width: '50%' },
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
          label: 'Last name',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'institution',
      type: 'relationship',
      relationTo: 'institutions',
      label: 'Institution',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Photo',
      admin: mediaFolderUploadAdmin(PEOPLE_PHOTOS_FOLDER_NAME, {
        description: `Optional profile photo. Stored in the Media folder "${PEOPLE_PHOTOS_FOLDER_NAME}".`,
      }),
    },
    {
      name: 'bio',
      type: 'richText',
      editor: flexibleLexical,
      label: 'Bio',
    },
    {
      name: 'fullName',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Auto-generated from first and last name.',
      },
    },
    {
      name: 'note',
      type: 'textarea',
      label: 'Note',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeValidate: [populateFullName],
    afterChange: [assignPhotoToFolder],
  },
}
