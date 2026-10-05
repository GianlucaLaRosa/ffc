import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { adminGroups, copy } from '@/i18n/copy'

export const Countries: CollectionConfig<'countries'> = {
  slug: 'countries',
  labels: {
    singular: copy('Country', 'Paese'),
    plural: copy('Countries', 'Paesi'),
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  defaultSort: 'name',
  admin: {
    group: adminGroups.references,
    useAsTitle: 'name',
    defaultColumns: ['name', 'updatedAt'],
    description: copy(
      'World countries for institutions. Reference data (seeded).',
      'Paesi del mondo per gli enti. Dati di riferimento (seed).',
    ),
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
