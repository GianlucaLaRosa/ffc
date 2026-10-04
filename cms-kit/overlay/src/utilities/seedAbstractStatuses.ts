import type { Payload } from 'payload'

/** Section titles when status is `new` or `ongoing`. */
export const DEFAULT_CONTENT_TITLES_IN_PROGRESS = [
  'Background and rationale',
  'Hypothesis and objectives',
  'Essential methods',
  'Preliminary results',
  'Conclusions',
] as const

/** Section titles when status is `concluded`. */
export const DEFAULT_CONTENT_TITLES_CONCLUDED = [
  'Background and rationale',
  'Hypothesis and objectives',
  'Essential methods',
  'Results',
  'Conclusions',
] as const

type DefaultContentRow = { title: string }

export const DEFAULT_ABSTRACT_STATUS_SEEDS = [
  {
    status: 'new',
    defaultContent: DEFAULT_CONTENT_TITLES_IN_PROGRESS.map((title) => ({ title })),
  },
  {
    status: 'ongoing',
    defaultContent: DEFAULT_CONTENT_TITLES_IN_PROGRESS.map((title) => ({ title })),
  },
  {
    status: 'concluded',
    defaultContent: DEFAULT_CONTENT_TITLES_CONCLUDED.map((title) => ({ title })),
  },
] as const satisfies ReadonlyArray<{
  status: string
  defaultContent: DefaultContentRow[]
}>

const hasDefaultContent = (value: unknown): boolean =>
  Array.isArray(value) && value.length > 0

/**
 * Ensures the default abstract status documents exist (idempotent).
 * Creates missing statuses; fills `defaultContent` only when empty/absent.
 */
export async function seedAbstractStatuses({ payload }: { payload: Payload }): Promise<void> {
  for (const seed of DEFAULT_ABSTRACT_STATUS_SEEDS) {
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
