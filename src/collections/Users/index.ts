import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { copy, adminGroups } from '@/i18n/copy'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  labels: {
    singular: copy('User', 'Utente'),
    plural: copy('Users', 'Utenti'),
  },
  admin: {
    group: adminGroups.content,
    defaultColumns: ['email', 'name'],
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
  timestamps: true,
}
