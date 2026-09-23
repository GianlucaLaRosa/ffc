import type { CollectionConfig } from 'payload'

export const Countries: CollectionConfig = {
  slug: 'countries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'code'],
    group: 'Locations & Entities',
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
      label: 'Country Name (in English)',
    },
    {
      name: 'code',
      type: 'text',
      label: 'ISO Code (2-letter)',
    },
  ],
}
