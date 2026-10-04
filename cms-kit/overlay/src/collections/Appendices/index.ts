import type { CollectionConfig, RelationshipFieldValidation } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { InstitutionsAppendixBlock } from './blocks/institutions'
import { BasicTextAppendixBlock } from './blocks/basicText'
import { ReviewersAppendixBlock } from './blocks/reviewers'
import { ResearchProjectsAppendixBlock } from './blocks/researchProjects'
import { pruneExcludedInstitutions } from './hooks/pruneExcludedInstitutions'

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
    return 'This conference already has an appendix. Edit the existing one instead.'
  }

  return true
}

export const Appendices: CollectionConfig<'appendices'> = {
  slug: 'appendices',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    hidden: true,
    group: 'Conferences',
    useAsTitle: 'conference',
    defaultColumns: ['conference', 'updatedAt', '_status'],
    description:
      'One appendix per conference edition. Add ordered blocks (basic text, institutions list, …) and drag to reorder.',
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
          'Each block has a required title and an optional description. Drag to reorder.',
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
          'Conference edition this appendix belongs to. Each conference may have only one appendix.',
      },
    },
  ],
  hooks: {
    beforeValidate: [pruneExcludedInstitutions],
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
