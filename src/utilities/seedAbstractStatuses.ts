import type { Payload } from 'payload'

import { ABSTRACT_STATUS_SEEDS } from '../seed/data/abstractStatuses'

const hasDefaultContent = (value: unknown): boolean =>
  Array.isArray(value) && value.length > 0

/**
 * Ensures the default abstract status documents exist (idempotent).
 * Creates missing statuses; fills `defaultContent` only when empty/absent.
 */
export async function seedAbstractStatuses({ payload }: { payload: Payload }): Promise<void> {
  for (const seed of ABSTRACT_STATUS_SEEDS) {
    const existing = await payload.find({
      collection: 'abstract-statuses',
      depth: 0,
      limit: 1,
      pagination: false,
      where: {
        status: {
          equals: seed.status,
        },
      },
    })

    const doc = existing.docs[0]

    if (doc) {
      if (hasDefaultContent(doc.defaultContent)) continue

      try {
        await payload.update({
          collection: 'abstract-statuses',
          id: doc.id,
          data: {
            defaultContent: [...seed.defaultContent],
          },
        })
      } catch (err) {
        payload.logger.error({
          err,
          msg: `Failed to seed default content for abstract status "${seed.status}"`,
        })
      }
      continue
    }

    try {
      await payload.create({
        collection: 'abstract-statuses',
        data: {
          status: seed.status,
          defaultContent: [...seed.defaultContent],
        },
      })
    } catch (err) {
      payload.logger.error({
        err,
        msg: `Failed to seed abstract status "${seed.status}"`,
      })
    }
  }
}
