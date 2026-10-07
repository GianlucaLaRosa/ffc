/** Matches Payload’s plugin type until it documents private stores. */
export type VercelBlobAccess = 'public' | 'private'

/**
 * Vercel Blob store access level. Must match the store in the Vercel dashboard.
 * New stores default to private; set BLOB_ACCESS=public only for a public store.
 */
export function getVercelBlobAccess(): VercelBlobAccess {
  const configured = process.env.BLOB_ACCESS?.trim().toLowerCase()
  if (configured === 'public' || configured === 'private') return configured
  return process.env.VERCEL ? 'private' : 'public'
}

export function isPrivateBlobUrl(url: string): boolean {
  return url.includes('.private.blob.vercel-storage.com')
}
