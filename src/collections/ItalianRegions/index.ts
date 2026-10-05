import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

export const ItalianRegions: CollectionConfig<'italian-regions'> = {
  slug: 'italian-regions',
  labels: {
    singular: 'Regione italiana',
    plural: 'Regioni italiane',
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
    description: 'Regioni italiane per gli indirizzi degli enti. Dati di riferimento (seed).',
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
