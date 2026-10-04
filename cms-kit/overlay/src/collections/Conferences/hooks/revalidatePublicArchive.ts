import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidateTag } from 'next/cache'

const revalidateArchiveTags = ({
  slug,
  previousSlug,
  payload,
}: {
  slug?: string | null
  previousSlug?: string | null
  payload: { logger: { info: (message: string) => void } }
}) => {
  payload.logger.info(`Revalidating conference public archive`)

  revalidateTag('conference-archive', 'max')

  if (slug) {
    revalidateTag(`conference_${slug}`, 'max')
  }

  if (previousSlug && previousSlug !== slug) {
    revalidateTag(`conference_${previousSlug}`, 'max')
  }
}

export const revalidatePublicArchive: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc

  const archiveChanged = doc.publicArchive !== previousDoc?.publicArchive
  const slugChanged = doc.slug !== previousDoc?.slug
  const statusChanged = doc._status !== previousDoc?._status

  if (archiveChanged || slugChanged || statusChanged || doc.publicArchive) {
    revalidateArchiveTags({
      slug: doc.slug,
      previousSlug: previousDoc?.slug,
      payload,
    })
  }

  return doc
}

export const revalidatePublicArchiveDelete: CollectionAfterDeleteHook = ({
  doc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc

  if (doc?.publicArchive || doc?.slug) {
    revalidateArchiveTags({
      slug: doc.slug,
      payload,
    })
  }

  return doc
}
