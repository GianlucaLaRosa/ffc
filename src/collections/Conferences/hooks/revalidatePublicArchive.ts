import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

/**
 * Public pages currently use force-dynamic. Calling revalidateTag during
 * admin SSR (autosave) throws in Next.js 16. Restore tags when the site caches.
 */
export const revalidatePublicArchive: CollectionAfterChangeHook = ({ doc }) => doc

export const revalidatePublicArchiveDelete: CollectionAfterDeleteHook = ({ doc }) => doc
