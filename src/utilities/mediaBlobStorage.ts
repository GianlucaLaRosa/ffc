/** Must match `vercelBlobStorage({ collections: { media: { prefix } } })`. */
export const MEDIA_BLOB_PREFIX = 'media'

export function mediaBlobObjectKey(filename: string): string {
  return `${MEDIA_BLOB_PREFIX}/${filename}`
}
