import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

export const AbstractStatuses: CollectionConfig<'abstract-statuses'> = {
  slug: 'abstract-statuses',
  labels: {
    singular: 'Stato abstract',
    plural: 'Stati abstract',
  },
  orderable: true,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Riferimenti',
    useAsTitle: 'status',
    defaultColumns: ['status', 'updatedAt'],
    description: 'Stati del flusso abstract. Seed; modificare solo se servono etichette o colori diversi.',
  },
  fields: [
    {
      name: 'status',
      type: 'text',
      required: true,
      unique: true,
      label: 'Status',
      admin: {
        description: 'Chiave dello stato (es. new, ongoing, concluded).',
      },
    },
    {
      name: 'defaultContent',
      type: 'array',
      label: 'Default content',
      labels: {
        singular: 'Section',
        plural: 'Sections',
      },
      admin: {
        description:
          'Titoli di sezione copiati sull’abstract quando selezionate questo Status e Content è vuoto. Lasciate vuoto per non copiare nulla.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Title',
        },
      ],
    },
  ],
}
