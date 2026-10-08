/** Matches Payload’s plugin type until it documents private stores. */
export type VercelBlobAccess = 'public' | 'private'

/** Strip wrapping quotes Vercel UI sometimes saves literally in env values. */
export function normalizeEnvValue(value: string | undefined): string | undefined {
  if (value == null) return undefined
  const trimmed = value.trim()
  if (!trimmed) return undefined
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim() || undefined
  }
  return trimmed
}

export function getBlobReadWriteToken(): string | undefined {
  return normalizeEnvValue(process.env.BLOB_READ_WRITE_TOKEN)
}

export function getBlobStoreIdFromToken(token: string | undefined): string | null {
  const normalized = normalizeEnvValue(token)
  return normalized?.match(/^vercel_blob_rw_([a-z\d]+)/i)?.[1]?.toLowerCase() ?? null
}

/** Vercel injects `BLOB_STORE_ID`; locally it can be derived from the read-write token. */
export function getBlobStoreId(): string | undefined {
  return (
    normalizeEnvValue(process.env.BLOB_STORE_ID) ??
    getBlobStoreIdFromToken(getBlobReadWriteToken()) ??
    undefined
  )
}

/**
 * Vercel Blob store access level. Must match the store in the Vercel dashboard.
 * New stores default to private; set BLOB_ACCESS=public only for a public store.
 */
export function getVercelBlobAccess(): VercelBlobAccess {
  const configured = normalizeEnvValue(process.env.BLOB_ACCESS)?.toLowerCase()
  if (configured === 'public' || configured === 'private') return configured
  return process.env.VERCEL ? 'private' : 'public'
}

export function isPrivateBlobUrl(url: string): boolean {
  return url.includes('.private.blob.vercel-storage.com')
}
