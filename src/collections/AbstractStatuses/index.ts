import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

export const AbstractStatuses: CollectionConfig<'abstract-statuses'> = {
  slug: 'abstract-statuses',
  orderable: true,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Reference',
    useAsTitle: 'status',
    defaultColumns: ['status', 'updatedAt'],
    description: 'Abstract workflow statuses. Seeded; edit only if labels or colors need changing.',
  },
  fields: [
    {
      name: 'status',
      type: 'text',
      required: true,
      unique: true,
      label: 'Status',
      admin: {
        description: 'Machine-readable status key (e.g. new, ongoing, concluded).',
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
          'Section titles seeded onto an abstract when this status is selected and Content is empty. Leave empty to seed nothing.',
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
