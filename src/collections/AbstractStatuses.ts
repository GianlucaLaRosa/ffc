import type { CollectionConfig } from 'payload'

export const AbstractStatuses: CollectionConfig = {
  slug: 'abstract-statuses',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
    group: 'Scientific Content',
  },
  access: {
    read: () => true,
  },
  fields: [
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
