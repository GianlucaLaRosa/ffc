import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { adminGroups, copy } from '@/i18n/copy'

export const AbstractStatuses: CollectionConfig<'abstract-statuses'> = {
  slug: 'abstract-statuses',
  labels: {
    singular: copy('Abstract status', 'Stato abstract'),
    plural: copy('Abstract statuses', 'Stati abstract'),
  },
  orderable: true,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: adminGroups.references,
    useAsTitle: 'status',
    defaultColumns: ['status', 'updatedAt'],
    description: copy(
      'Abstract workflow statuses. Seeded; change only if you need different labels or colours.',
      'Stati del flusso abstract. Seed; modificare solo se servono etichette o colori diversi.',
    ),
  },
  fields: [
    {
      name: 'status',
      type: 'text',
      required: true,
      unique: true,
      label: 'Status',
      admin: {
        description: copy(
          'Status key (e.g. new, ongoing, concluded).',
          'Chiave dello stato (es. new, ongoing, concluded).',
        ),
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
        description: copy(
          'Section titles copied onto the abstract when you select this Status and Content is empty. Leave empty to copy nothing.',
          'Titoli di sezione copiati sull’abstract quando selezionate questo Status e Content è vuoto. Lasciate vuoto per non copiare nulla.',
        ),
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
