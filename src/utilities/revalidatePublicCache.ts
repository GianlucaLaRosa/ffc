import { revalidateTag } from 'next/cache'
import { after } from 'next/server'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  PayloadRequest,
} from 'payload'

import { CACHE_TAGS, conferenceIdTag, conferenceSlugTag } from '@/utilities/cacheTags'

function relationId(value: unknown): number | string | null {
  if (value == null) return null
  if (typeof value === 'object' && value !== null && 'id' in value) {
    return (value as { id: number | string }).id
  }
  if (typeof value === 'number' || typeof value === 'string') return value
  return null
}

type Logger = { info: (message: string) => void }

function uniqueIds(values: Array<number | string | null | undefined>): Array<number | string> {
  const seen = new Set<string>()
  const ids: Array<number | string> = []
  for (const value of values) {
    if (value == null) continue
    const key = String(value)
    if (seen.has(key)) continue
    seen.add(key)
    ids.push(value)
  }
  return ids
}

function isAutosaveRequest(req: PayloadRequest): boolean {
  const autosave = req.query?.autosave
  return autosave === true || autosave === 'true'
}

export function shouldRevalidatePublic(req: PayloadRequest): boolean {
  if (req.context?.disableRevalidate) return false
  if (isAutosaveRequest(req)) return false
  return true
}

function hasPublishedVersion(
  doc: { _status?: string | null } | null | undefined,
  previousDoc?: { _status?: string | null } | null,
): boolean {
  const current = doc?._status
  const previous = previousDoc?._status
  if (current == null && previous == null) return true
  return current === 'published' || previous === 'published'
}

export function scheduleTagRevalidation(tags: Iterable<string>, logger?: Logger): void {
  const unique = [...new Set(tags)].filter(Boolean)
  if (unique.length === 0) return

  const run = () => {
    for (const tag of unique) {
      revalidateTag(tag, 'max')
    }
    logger?.info(`Revalidated tags: ${unique.join(', ')}`)
  }

  try {
    after(run)
  } catch {
    run()
  }
}

async function tagsForConferenceIds(
  req: PayloadRequest,
  conferenceIds: Array<number | string>,
): Promise<string[]> {
  const tags = new Set<string>([CACHE_TAGS.public])

  for (const id of conferenceIds) {
    tags.add(conferenceIdTag(id))
    try {
      const conference = await req.payload.findByID({
        collection: 'conferences',
        id,
        depth: 0,
        draft: true,
        overrideAccess: true,
        req,
        select: { slug: true },
        context: { disableRevalidate: true },
      })
      if (typeof conference.slug === 'string' && conference.slug) {
        tags.add(conferenceSlugTag(conference.slug))
      }
    } catch {
      // Conference may already be gone (delete hooks).
    }
  }

  return [...tags]
}

async function conferenceIdsFromDays(
  req: PayloadRequest,
  dayIds: Array<number | string>,
): Promise<Array<number | string>> {
  if (dayIds.length === 0) return []

  const { docs } = await req.payload.find({
    collection: 'conference-days',
    depth: 0,
    draft: true,
    limit: dayIds.length,
    overrideAccess: true,
    pagination: false,
    req,
    select: { conference: true },
    where: { id: { in: dayIds } },
    context: { disableRevalidate: true },
  })

  return uniqueIds(docs.map((day) => relationId(day.conference)))
}

function conferenceIdFromDoc(doc: unknown): number | string | null {
  if (!doc || typeof doc !== 'object') return null
  return relationId((doc as { conference?: unknown }).conference)
}

function dayIdFromDoc(doc: unknown): number | string | null {
  if (!doc || typeof doc !== 'object') return null
  return relationId((doc as { day?: unknown }).day)
}

export const revalidateFooter: GlobalAfterChangeHook = ({ doc, req }) => {
  if (!shouldRevalidatePublic(req)) return doc
  scheduleTagRevalidation([CACHE_TAGS.footer], req.payload.logger)
  return doc
}

export const revalidateProgrammeAlerts: GlobalAfterChangeHook = ({ doc, req }) => {
  if (!shouldRevalidatePublic(req)) return doc
  scheduleTagRevalidation([CACHE_TAGS.programmeAlerts, CACHE_TAGS.public], req.payload.logger)
  return doc
}

export const revalidateActiveConference: GlobalAfterChangeHook = ({ doc, req }) => {
  if (!shouldRevalidatePublic(req)) return doc
  scheduleTagRevalidation(
    [CACHE_TAGS.active, CACHE_TAGS.archive, CACHE_TAGS.public],
    req.payload.logger,
  )
  return doc
}

export const revalidatePublicArchive: CollectionAfterChangeHook = ({ doc, previousDoc, req }) => {
  if (!shouldRevalidatePublic(req)) return doc

  const tags = new Set<string>([
    CACHE_TAGS.archive,
    CACHE_TAGS.public,
    CACHE_TAGS.active,
  ])

  if (doc.id != null) tags.add(conferenceIdTag(doc.id))
  if (previousDoc?.id != null) tags.add(conferenceIdTag(previousDoc.id))
  if (typeof doc.slug === 'string' && doc.slug) tags.add(conferenceSlugTag(doc.slug))
  if (typeof previousDoc?.slug === 'string' && previousDoc.slug) {
    tags.add(conferenceSlugTag(previousDoc.slug))
  }

  scheduleTagRevalidation(tags, req.payload.logger)
  return doc
}

export const revalidatePublicArchiveDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  if (!shouldRevalidatePublic(req)) return doc

  const tags = new Set<string>([
    CACHE_TAGS.archive,
    CACHE_TAGS.public,
    CACHE_TAGS.active,
  ])
  if (doc?.id != null) tags.add(conferenceIdTag(doc.id))
  if (typeof doc?.slug === 'string' && doc.slug) tags.add(conferenceSlugTag(doc.slug))

  scheduleTagRevalidation(tags, req.payload.logger)
  return doc
}

export const revalidateEditionByConference: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  if (!shouldRevalidatePublic(req)) return doc
  if (!hasPublishedVersion(doc, previousDoc)) return doc

  const tags = await tagsForConferenceIds(
    req,
    uniqueIds([conferenceIdFromDoc(doc), conferenceIdFromDoc(previousDoc)]),
  )
  scheduleTagRevalidation(tags, req.payload.logger)
  return doc
}

export const revalidateEditionByConferenceDelete: CollectionAfterDeleteHook = async ({
  doc,
  req,
}) => {
  if (!shouldRevalidatePublic(req)) return doc

  const tags = await tagsForConferenceIds(req, uniqueIds([conferenceIdFromDoc(doc)]))
  scheduleTagRevalidation(tags, req.payload.logger)
  return doc
}

export const revalidateEditionByDay: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  if (!shouldRevalidatePublic(req)) return doc
  if (!hasPublishedVersion(doc, previousDoc)) return doc

  const conferenceIds = await conferenceIdsFromDays(
    req,
    uniqueIds([dayIdFromDoc(doc), dayIdFromDoc(previousDoc)]),
  )
  const tags = await tagsForConferenceIds(req, conferenceIds)
  scheduleTagRevalidation(tags, req.payload.logger)
  return doc
}

export const revalidateEditionByDayDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  if (!shouldRevalidatePublic(req)) return doc

  const conferenceIds = await conferenceIdsFromDays(req, uniqueIds([dayIdFromDoc(doc)]))
  const tags = await tagsForConferenceIds(req, conferenceIds)
  scheduleTagRevalidation(tags, req.payload.logger)
  return doc
}

/** People / institutions are shared across editions; bust every public edition fetch. */
export const revalidatePublicDirectories: CollectionAfterChangeHook = ({ doc, req }) => {
  if (!shouldRevalidatePublic(req)) return doc
  scheduleTagRevalidation([CACHE_TAGS.public], req.payload.logger)
  return doc
}

export const revalidatePublicDirectoriesDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  if (!shouldRevalidatePublic(req)) return doc
  scheduleTagRevalidation([CACHE_TAGS.public], req.payload.logger)
  return doc
}
