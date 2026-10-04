import type { Payload } from 'payload'

import { WORLD_COUNTRIES } from '../seed/data/countries'

/**
 * Ensures all world country documents exist (idempotent).
 */
export async function seedCountries({ payload }: { payload: Payload }): Promise<void> {
  const { docs } = await payload.find({
    collection: 'countries',
    depth: 0,
    limit: 1000,
    pagination: false,
    select: { name: true },
  })

  const existing = new Set(docs.map((doc) => doc.name))

  for (const name of WORLD_COUNTRIES) {
    if (existing.has(name)) continue

    try {
      await payload.create({
        collection: 'countries',
        data: { name },
      })
    } catch (err) {
      payload.logger.error({
        err,
        msg: `Failed to seed country "${name}"`,
      })
    }
  }
}
