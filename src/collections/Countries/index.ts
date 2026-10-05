import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

export const Countries: CollectionConfig<'countries'> = {
  slug: 'countries',
  labels: {
    singular: 'Paese',
    plural: 'Paesi',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  defaultSort: 'name',
  admin: {
    group: 'Riferimenti',
    useAsTitle: 'name',
    defaultColumns: ['name', 'updatedAt'],
    description: 'Paesi del mondo per gli enti. Dati di riferimento (seed).',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      label: 'Name',
    },
  ],
}
