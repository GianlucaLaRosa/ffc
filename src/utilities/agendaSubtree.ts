import type { Payload, PayloadRequest } from 'payload'

/** Root id plus nested child agenda items (any depth). */
export async function collectAgendaSubtreeIds({
  payload,
  rootId,
  req,
}: {
  payload: Payload
  rootId: number | string
  req?: PayloadRequest
}): Promise<Set<string>> {
  const ids = new Set<string>([String(rootId)])
  let frontier: Array<number | string> = [rootId]

  while (frontier.length > 0) {
    const { docs } = await payload.find({
      collection: 'agenda-items',
      where: { parent: { in: frontier } },
      depth: 0,
      draft: true,
      limit: 500,
      pagination: false,
      overrideAccess: true,
      req,
      select: { id: true },
    })
    frontier = []
    for (const doc of docs) {
      const id = String(doc.id)
      if (ids.has(id)) continue
      ids.add(id)
      frontier.push(doc.id)
    }
  }

  return ids
}
