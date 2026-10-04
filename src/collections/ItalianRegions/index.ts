import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

export const ItalianRegions: CollectionConfig<'italian-regions'> = {
  slug: 'italian-regions',
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
    description: 'Italian regions for institution addresses. Seeded reference data.',
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
