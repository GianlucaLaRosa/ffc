import type { PayloadRequest } from 'payload'

export const toRelationId = (value: unknown): number | string | null => {
  if (value == null) return null
  if (typeof value === 'object' && value !== null && 'id' in value) {
    return (value as { id: number | string }).id
  }
  if (typeof value === 'number' || typeof value === 'string') return value
  return null
}

/**
 * Institution IDs of non–team-member authors on abstracts of a conference.
 * Used to exclude those institutions from the appendix institutions picker.
 */
export const collectExcludedInstitutionIds = async ({
  conferenceId,
  req,
}: {
  conferenceId: number | string
  req: PayloadRequest
}): Promise<Array<number | string>> => {
  const { docs: abstracts } = await req.payload.find({
    collection: 'abstracts',
    depth: 0,
    draft: true,
    limit: 1000,
    overrideAccess: true,
    pagination: false,
    req,
    select: {
      authors: true,
    },
    where: {
      conference: {
        equals: conferenceId,
      },
    },
  })

  const personIds = new Set<string>()
  for (const abstract of abstracts) {
    const authors = Array.isArray(abstract.authors) ? abstract.authors : []
    for (const row of authors) {
      if (row?.role === 'teamMember') continue
      const personId = toRelationId(row?.person)
      if (personId != null) personIds.add(String(personId))
    }
  }

  if (personIds.size === 0) return []

  const { docs: people } = await req.payload.find({
    collection: 'people',
    depth: 0,
    limit: personIds.size,
    overrideAccess: true,
    pagination: false,
    req,
    select: {
      institution: true,
    },
    where: {
      id: {
        in: [...personIds],
      },
    },
  })

  const institutionIds = new Set<string>()
  for (const person of people) {
    const institutionId = toRelationId(person.institution)
    if (institutionId != null) institutionIds.add(String(institutionId))
  }

  return [...institutionIds]
}
