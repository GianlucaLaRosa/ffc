import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const ProgrammePushSubscriptions: CollectionConfig = {
  slug: 'programme-push-subscriptions',
  admin: {
    hidden: true,
    group: 'Content',
    useAsTitle: 'endpoint',
    description: 'Browser push endpoints for My programme session alerts. Not edited in admin.',
  },
  access: {
    create: () => false,
    delete: authenticated,
    read: authenticated,
    update: () => false,
  },
  fields: [
    {
      name: 'endpoint',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'p256dh',
      type: 'text',
      required: true,
    },
    {
      name: 'auth',
      type: 'text',
      required: true,
    },
    {
      name: 'conference',
      type: 'number',
      required: true,
      index: true,
    },
    {
      name: 'canonicalPath',
      type: 'text',
      defaultValue: '/',
    },
    {
      name: 'items',
      type: 'json',
      required: true,
    },
    {
      name: 'notifiedSoon',
      type: 'json',
    },
    {
      name: 'notifiedLive',
      type: 'json',
    },
  ],
}
