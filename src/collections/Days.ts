import type { CollectionConfig } from 'payload'

export const Days: CollectionConfig = {
  slug: 'days',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'order'],
    group: 'Conference',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Day Title (e.g. Day 1, Day 2)',
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Order',
      defaultValue: 1,
      admin: {
        step: 1,
      },
    },
  ],
}
