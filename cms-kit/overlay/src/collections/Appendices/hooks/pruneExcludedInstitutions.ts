import type { CollectionBeforeValidateHook } from 'payload'

import {
  collectExcludedInstitutionIds,
  toRelationId,
} from '@/utilities/appendixInstitutions'

type InstitutionsBlock = {
  blockType?: string
  institutions?: unknown
  [key: string]: unknown
}

const relationIds = (value: unknown): Array<number | string> => {
  if (!Array.isArray(value)) return []
  return value
    .map(toRelationId)
    .filter((id): id is number | string => id != null)
}

/**
 * Drop selected institutions that are now used by non–team-member abstract authors
 * (so the saved list stays within the picker’s allowed set).
 */
export const pruneExcludedInstitutions: CollectionBeforeValidateHook = async ({
  data,
  originalDoc,
  req,
}) => {
  if (!data) return data

  const conferenceId = toRelationId(data.conference ?? originalDoc?.conference)
  if (conferenceId == null) return data

  const blocks = Array.isArray(data.blocks)
    ? (data.blocks as InstitutionsBlock[])
    : Array.isArray(originalDoc?.blocks)
      ? (originalDoc.blocks as InstitutionsBlock[])
      : null

  if (!blocks?.length) return data

  const hasInstitutionsBlock = blocks.some((b) => b?.blockType === 'institutions')
  if (!hasInstitutionsBlock) return data

  const excluded = new Set(
    (
      await collectExcludedInstitutionIds({
        conferenceId,
        req,
      })
    ).map(String),
  )

  if (excluded.size === 0) {
    if (!Array.isArray(data.blocks)) data.blocks = blocks
    return data
  }

  data.blocks = blocks.map((block) => {
    if (block?.blockType !== 'institutions') return block
    const selected = relationIds(block.institutions)
    return {
      ...block,
      institutions: selected.filter((id) => !excluded.has(String(id))),
    }
  })

  return data
}
