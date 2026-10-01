import type { CollectionConfig } from 'payload'
import { limitedRichTextEditor, limitedWithLinkRichTextEditor } from '../fields/lexicalEditors'

export const AgendaItems: CollectionConfig = {
  slug: 'agenda-items',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['day', 'startTime', 'endTime', 'isKeynote'],
    group: 'Conference',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'richText',
      editor: limitedRichTextEditor,
      required: true,
      label: 'Session / Talk Title (Bold, Italic, Underline, Sub/Superscript, Strikethrough)',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'day',
          type: 'relationship',
          relationTo: 'days',
          required: true,
          label: 'Conference Day',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'isKeynote',
          type: 'checkbox',
          label: 'Keynote Session (Highlight graphically)',
          defaultValue: false,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startTime',
          type: 'date',
          label: 'Start Time',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
            width: '33%',
          },
        },
        {
          name: 'endTime',
          type: 'date',
          label: 'End Time',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
            width: '33%',
          },
        },
        {
          name: 'duration',
          type: 'text',
          label: 'Duration (e.g. 45 min)',
          admin: {
            width: '34%',
          },
        },
      ],
    },
    {
      name: 'icon',
      type: 'select',
      label: 'Lucide Icon',
      admin: {
        description: 'Icon displayed beside session title.',
      },
      options: [
        { label: 'Microphone (Oral presentation)', value: 'mic' },
        { label: 'Users (Panel / Group)', value: 'users' },
        { label: 'Presentation (Slides / Keynote)', value: 'presentation' },
        { label: 'Flask Conical (Scientific / Research)', value: 'flask-conical' },
        { label: 'Coffee (Break / Networking)', value: 'coffee' },
        { label: 'Utensils (Lunch / Dinner)', value: 'utensils' },
        { label: 'Award (Ceremony / Prize)', value: 'award' },
        { label: 'Book Open (Abstract session)', value: 'book-open' },
        { label: 'Stethoscope (Clinical track)', value: 'stethoscope' },
        { label: 'Dna (Genetics track)', value: 'dna' },
        { label: 'Activity (Medical vital)', value: 'activity' },
        { label: 'Video (Hybrid / Stream)', value: 'video' },
        { label: 'Message Square (Q&A / Roundtable)', value: 'message-square' },
        { label: 'Music (Gala / Social)', value: 'music' },
        { label: 'Check Circle (Closing remarks)', value: 'check-circle' },
        { label: 'Calendar (Schedule item)', value: 'calendar' },
        { label: 'Clock (Timing item)', value: 'clock' },
        { label: 'Map Pin (Room / Location)', value: 'map-pin' },
        { label: 'Info (General notice)', value: 'info' },
      ],
    },
    {
      name: 'abstract',
      type: 'relationship',
      relationTo: 'abstracts',
      label: 'Linked Scientific Abstract',
      admin: {
        description:
          'Clicking this agenda item in the frontend will open the full-screen view for this abstract.',
      },
    },
    {
      name: 'children',
      type: 'relationship',
      relationTo: 'agenda-items',
      hasMany: true,
      label: 'Session Items / Parallel Tracks (Children)',
      admin: {
        description: 'Nested talks or sub-events under this session.',
      },
    },
    {
      name: 'description',
      type: 'richText',
      editor: limitedWithLinkRichTextEditor,
      label: 'Session Description & Notes',
    },
  ],
}
