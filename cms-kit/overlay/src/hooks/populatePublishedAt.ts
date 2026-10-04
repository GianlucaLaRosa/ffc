import type { CollectionBeforeChangeHook } from 'payload'

/** Stamp publishedAt once, when first published. Do not refresh it on later saves. */
export const populatePublishedAt: CollectionBeforeChangeHook = ({
  data,
  operation,
  originalDoc,
}) => {
  if (data?.publishedAt) return data
  if (originalDoc?.publishedAt) return data

  const publishing =
    data?._status === 'published' ||
    (operation === 'create' && data?._status !== 'draft')

  if (!publishing) return data

  return {
    ...data,
    publishedAt: new Date().toISOString(),
  }
}
