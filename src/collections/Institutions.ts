import type { CollectionConfig } from 'payload'

export const Institutions: CollectionConfig = {
  slug: 'institutions',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'country', 'region'],
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
      label: 'Institution Name',
    },
    {
      name: 'country',
      type: 'relationship',
      relationTo: 'countries',
      required: true,
      label: 'Country',
    },
    {
      name: 'region',
      type: 'relationship',
      relationTo: 'italian-regions',
      label: 'Italian Region (if applicable)',
    },
  ],
}
