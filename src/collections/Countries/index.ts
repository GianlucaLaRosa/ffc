import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

export const Countries: CollectionConfig<'countries'> = {
  slug: 'countries',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  defaultSort: 'name',
  admin: {
    group: 'Reference',
    useAsTitle: 'name',
    defaultColumns: ['name', 'updatedAt'],
    description: 'World countries for institutions. Seeded reference data.',
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
