import type { CollectionConfig, RelationshipFieldValidation } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { InstitutionsAppendixBlock } from './blocks/institutions'
import { BasicTextAppendixBlock } from './blocks/basicText'
import { ReviewersAppendixBlock } from './blocks/reviewers'
import { ResearchProjectsAppendixBlock } from './blocks/researchProjects'
import { pruneExcludedInstitutions } from './hooks/pruneExcludedInstitutions'
import {
  revalidateEditionByConference,
  revalidateEditionByConferenceDelete,
} from '@/utilities/revalidatePublicCache'

const validateUniqueConference: RelationshipFieldValidation = async (value, { req, id }) => {
  if (value == null) return true

  const conferenceID = typeof value === 'object' && value !== null && 'id' in value ? value.id : value

  const existing = await req.payload.find({
    collection: 'appendices',
    where: {
      and: [
        { conference: { equals: conferenceID } },
        ...(id != null ? [{ id: { not_equals: id } }] : []),
      ],
    },
    limit: 1,
    depth: 0,
    req,
  })

  if (existing.docs.length > 0) {
    return 'Questa conferenza ha già un’appendice. Modificate quella esistente.'
  }

  return true
}

export const Appendices: CollectionConfig<'appendices'> = {
  slug: 'appendices',
  labels: {
    singular: 'Appendice',
    plural: 'Appendici',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    hidden: true,
    group: 'Conferenze',
    useAsTitle: 'conference',
    defaultColumns: ['conference', 'updatedAt', '_status'],
    description:
      'Un’appendice per edizione. Aggiungete blocchi ordinati (testo, elenco enti, …) e trascinateli per l’ordine.',
  },
  fields: [
    {
      name: 'blocks',
      type: 'blocks',
      label: 'Blocks',
      labels: {
        singular: 'Block',
        plural: 'Blocks',
      },
      required: true,
      minRows: 1,
      blocks: [
        BasicTextAppendixBlock,
        ReviewersAppendixBlock,
        ResearchProjectsAppendixBlock,
        InstitutionsAppendixBlock,
      ],
      admin: {
        description:
          'Ogni blocco ha un Title obbligatorio (etichetta della linguetta). Basic text usa le stesse colonne Content, accordion e layout dell’intro. Trascinate per riordinare le linguette.',
      },
    },
    {
      name: 'conference',
      type: 'relationship',
      relationTo: 'conferences',
      required: true,
      unique: true,
      index: true,
      label: 'Conference',
      validate: validateUniqueConference,
      admin: {
        position: 'sidebar',
        description:
          'Edizione a cui appartiene questa appendice. Ogni conferenza può averne una sola.',
      },
    },
  ],
  hooks: {
    beforeValidate: [pruneExcludedInstitutions],
    afterChange: [revalidateEditionByConference],
    afterDelete: [revalidateEditionByConferenceDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 25,
  },
}
