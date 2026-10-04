import type { GlobalAfterChangeHook } from 'payload'

const relationshipId = (value: unknown): number | string | null => {
  if (typeof value === 'object' && value !== null && 'id' in value) {
    const id = (value as { id?: number | string }).id
    return id ?? null
  }

  if (typeof value === 'number' || typeof value === 'string') return value

  return null
}

/** The active edition lives at `/`, so it must not stay listed in the public archive. */
export const clearActivePublicArchive: GlobalAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  const nextId = relationshipId(doc.conference)
  const previousId = relationshipId(previousDoc?.conference)

  if (nextId == null || String(nextId) === String(previousId)) return doc

  try {
    const conference = await req.payload.findByID({
      collection: 'conferences',
      id: nextId,
      depth: 0,
      draft: false,
      req,
      select: {
        publicArchive: true,
      },
    })

    if (!conference.publicArchive) return doc

    await req.payload.update({
      collection: 'conferences',
      id: nextId,
      data: {
        publicArchive: false,
      },
      depth: 0,
      draft: false,
      req,
    })
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: `Failed to clear public archive on active conference ${nextId}`,
    })
  }

  return doc
}
