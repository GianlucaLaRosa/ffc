import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const ProgrammePushSubscriptions: CollectionConfig = {
  slug: 'programme-push-subscriptions',
  admin: {
    hidden: true,
    group: 'Contenuti',
    useAsTitle: 'endpoint',
    description: 'Endpoint push del browser per gli avvisi di My programme. Non si modificano da qui.',
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
      name: 'conferenceUpdates',
      type: 'checkbox',
      defaultValue: true,
      index: true,
      admin: {
        description:
          'Se è vero, questo endpoint riceve anche gli avvisi editoriali (sala/orario), non solo i promemoria di sessione.',
      },
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
