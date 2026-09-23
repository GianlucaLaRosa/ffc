import type { CollectionConfig } from 'payload'
import { limitedRichTextEditor, limitedWithLinkRichTextEditor } from '../fields/lexicalEditors'

export const Conferences: CollectionConfig = {
  slug: 'conferences',
  admin: {
    useAsTitle: 'editionYear',
    defaultColumns: ['editionYear', 'startDate', 'endDate', 'city'],
    group: 'Conference',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'editionName',
      type: 'richText',
      editor: limitedRichTextEditor,
      required: true,
      label: 'Edition Name (Bold, Italic, Strikethrough, Underline, Sub/Superscript)',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'editionYear',
          type: 'number',
          required: true,
          label: 'Edition Year (e.g. 2026)',
          admin: {
            width: '33%',
          },
        },
        {
          name: 'primaryColor',
          type: 'text',
          defaultValue: '#0d5c3a',
          label: 'Primary Brand Color (Hex, e.g. #0d5c3a)',
          admin: {
            width: '33%',
          },
        },
        {
          name: 'accentColor',
          type: 'text',
          defaultValue: '#2ecc71',
          label: 'Accent Color (Hex, e.g. #2ecc71)',
          admin: {
            width: '34%',
          },
        },
      ],
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Conference Edition Logo',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          required: true,
          label: 'Conference Start Date & Time',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
            width: '50%',
          },
        },
        {
          name: 'endDate',
          type: 'date',
          required: true,
          label: 'Conference End Date & Time',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'days',
      type: 'relationship',
      relationTo: 'days',
      hasMany: true,
      required: true,
      label: 'Conference Days',
    },
    {
      name: 'generalDescription',
      type: 'richText',
      editor: limitedWithLinkRichTextEditor,
      label: 'General Description / Welcome Message',
    },
    {
      type: 'collapsible',
      label: 'Venue & Location Details',
      fields: [
        {
          name: 'street',
          type: 'text',
          label: 'Street Address',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'city',
              type: 'text',
              label: 'City',
              admin: {
                width: '50%',
              },
            },
            {
              name: 'country',
              type: 'text',
              label: 'Country',
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'locationCoords',
          type: 'group',
          label: 'Geographical Coordinates (Coordinates for Maps / Directions)',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'latitude',
                  type: 'number',
                  label: 'Latitude',
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'longitude',
                  type: 'number',
                  label: 'Longitude',
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'location',
          type: 'richText',
          editor: limitedWithLinkRichTextEditor,
          label: 'Venue Details & Logistics (Formatted info, directions, travel recommendations)',
        },
      ],
    },
  ],
}
