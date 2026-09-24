import type { CollectionConfig } from 'payload'

export const AbstractStatuses: CollectionConfig = {
  slug: 'abstract-statuses',
  defaultSort: 'order',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['order', 'name', 'slug', 'color'],
    group: 'Scientific Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'order',
      type: 'number',
      label: 'Order',
      defaultValue: 1,
      admin: {
        step: 1,
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      label: 'Status Name',
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug (e.g. new, ongoing, concluded)',
    },
    {
      name: 'color',
      type: 'text',
      label: 'Badge Color (Hex or CSS class)',
    },
  ],
}
