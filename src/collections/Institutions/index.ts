import type { CollectionBeforeValidateHook, CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { basicLexical } from '../../fields/basicLexical'
import {
  revalidatePublicDirectories,
  revalidatePublicDirectoriesDelete,
} from '@/utilities/revalidatePublicCache'
import { adminGroups, copy } from '@/i18n/copy'
import { ITALY_COUNTRY_NAME } from '@/utilities/groupInstitutions'

const toRelationId = (value: unknown): number | string | null => {
  if (value == null) return null
  if (typeof value === 'object' && value !== null && 'id' in value) {
    return (value as { id: number | string }).id
  }
  if (typeof value === 'number' || typeof value === 'string') return value
  return null
}

/** Region is only valid for Italy; clear it otherwise. */
const clearRegionUnlessItaly: CollectionBeforeValidateHook = async ({ data, req }) => {
  if (!data) return data

  const regionId = toRelationId(data.region)
  if (regionId == null) return data

  const countryId = toRelationId(data.country)
  if (countryId == null) {
    data.region = null
    return data
  }

  const country = await req.payload.findByID({
    collection: 'countries',
    id: countryId,
    depth: 0,
    overrideAccess: true,
    req,
    select: { name: true },
  })

  if (country.name !== ITALY_COUNTRY_NAME) {
    data.region = null
  }

  return data
}

export const Institutions: CollectionConfig<'institutions'> = {
  slug: 'institutions',
  labels: {
    singular: copy('Institution', 'Ente'),
    plural: copy('Institutions', 'Enti'),
  },
  orderable: true,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: adminGroups.people,
    useAsTitle: 'name',
    defaultColumns: ['name', 'country', 'region', 'updatedAt'],
    description: copy('Research institutes and labs.', 'Istituti di ricerca e laboratori.'),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name',
    },
    {
      name: 'country',
      type: 'relationship',
      relationTo: 'countries',
      required: true,
      index: true,
      label: 'Country',
    },
    {
      name: 'region',
      type: 'relationship',
      relationTo: 'italian-regions',
      index: true,
      label: 'Region',
      admin: {
        description: copy(
          'Available only when Country is Italy.',
          'Disponibile solo se Country è Italy.',
        ),
        components: {
          Field: '@/collections/Institutions/ItalianRegionField#ItalianRegionField',
        },
      },
    },
    {
      name: 'description',
      type: 'richText',
      editor: basicLexical,
      label: 'Description',
    },
  ],
  hooks: {
    beforeValidate: [clearRegionUnlessItaly],
    afterChange: [revalidatePublicDirectories],
    afterDelete: [revalidatePublicDirectoriesDelete],
  },
}
