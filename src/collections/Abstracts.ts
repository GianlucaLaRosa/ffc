import type { CollectionConfig } from 'payload'
import { limitedRichTextEditor } from '../fields/lexicalEditors'

export const Abstracts: CollectionConfig = {
  slug: 'abstracts',
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'status', 'updatedAt'],
    group: 'Scientific Content',
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        if (!data) return data
        // Synchronize mainSpeakers with selected speakers
        if (Array.isArray(data.speakers)) {
          const currentMainSpeakers = data.mainSpeakers || originalDoc?.mainSpeakers || []
          const currentMainMap = new Map<string, boolean>()
          for (const item of currentMainSpeakers) {
            const speakerId =
              typeof item.speaker === 'object' && item.speaker !== null
                ? (item.speaker as any)?.id
                : item.speaker
            if (speakerId) {
              currentMainMap.set(String(speakerId), Boolean(item.isMain))
            }
          }

          data.mainSpeakers = data.speakers.map((sp: any) => {
            const spId = typeof sp === 'object' && sp !== null ? sp.id : sp
            return {
              speaker: spId,
              isMain: currentMainMap.get(String(spId)) ?? false,
            }
          })
        }
        return data
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'code',
          type: 'text',
          label: 'Abstract Code (e.g. CF crio, ORAL-01)',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'status',
          type: 'relationship',
          relationTo: 'abstract-statuses',
          label: 'Abstract Status',
          admin: {
            width: '50%',
            sortOptions: 'order',
          },
        },
      ],
    },
    {
      name: 'title',
      type: 'richText',
      editor: limitedRichTextEditor,
      required: true,
      label: 'Abstract Title (Bold, Italic, Underline, Sub/Superscript, Strikethrough)',
    },
    {
      name: 'content',
      type: 'relationship',
      relationTo: 'abstract-contents',
      hasMany: true,
      label: 'Content Sections (Ordered 1-to-many)',
      admin: {
        description: 'Select content sections in order (e.g. Background, Methods, Results, Conclusions).',
      },
    },
    {
      name: 'authors',
      type: 'relationship',
      relationTo: 'people',
      hasMany: true,
      label: 'Authors (Ordered many-to-many)',
    },
    {
      name: 'photos',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      label: 'Photos & Figures',
    },
    {
      name: 'speakers',
      type: 'relationship',
      relationTo: 'people',
      hasMany: true,
      label: 'Speakers',
    },
    {
      name: 'mainSpeakers',
      type: 'array',
      label: 'Main Speakers Assignment',
      admin: {
        description:
          'Automatically synchronized from Speakers list. Check "Is Main Speaker" for plenary/main speakers.',
      },
      fields: [
        {
          name: 'speaker',
          type: 'relationship',
          relationTo: 'people',
          required: true,
        },
        {
          name: 'isMain',
          type: 'checkbox',
          label: 'Is Main Speaker',
          defaultValue: false,
        },
      ],
    },
  ],
}
