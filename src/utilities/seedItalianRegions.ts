import type { Payload } from 'payload'

import { ITALIAN_REGIONS } from '../seed/data/italianRegions'

/**
 * Ensures all Italian region documents exist (idempotent).
 */
export async function seedItalianRegions({ payload }: { payload: Payload }): Promise<void> {
  const { docs } = await payload.find({
    collection: 'italian-regions',
    depth: 0,
    limit: 1000,
    pagination: false,
    select: { name: true },
  })

  const existing = new Set(docs.map((doc) => doc.name))

  for (const name of ITALIAN_REGIONS) {
    if (existing.has(name)) continue

    try {
      await payload.create({
        collection: 'italian-regions',
        data: { name },
      })
    } catch (err) {
      payload.logger.error({
        err,
        msg: `Failed to seed Italian region "${name}"`,
      })
    }
  }
}
