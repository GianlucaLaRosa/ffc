import type { CollectionConfig } from 'payload'

export const ItalianRegions: CollectionConfig = {
  slug: 'italian-regions',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name'],
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
      label: 'Region Name (in Italian)',
    },
  ],
}
