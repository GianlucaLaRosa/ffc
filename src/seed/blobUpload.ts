/**
 * Payload Local API uploads do not reach Vercel Blob when disableLocalStorage is on.
 * Seed writes brochure files to Blob at `media/{filename}` after each media create.
 */
import { existsSync, readFileSync } from 'fs'
import path from 'path'
import { put } from '@vercel/blob'
import type { Payload } from 'payload'

import { CONVENTION_2025_PARTNERS } from '@/seed/data/convention2025'
import { ABSTRACT_PICTURES } from '@/seed/data/convention2025AbstractPictures'
import {
  getBlobReadWriteToken,
  getBlobStoreIdFromToken,
  getVercelBlobAccess,
} from '@/utilities/blobAccess'
import { getServerSideURL } from '@/utilities/getURL'
import { MEDIA_BLOB_PREFIX, mediaBlobObjectKey } from '@/utilities/mediaBlobStorage'

const BLOB_CACHE_MAX_AGE = 60 * 60 * 24 * 365
const SEED_CONTEXT = { disableRevalidate: true } as const

export function logBlobSeedTarget(payload: Payload): void {
  const token = getBlobReadWriteToken()
  const storeId = getBlobStoreIdFromToken(token)
  const publicUrl = getServerSideURL()

  if (!token) {
    payload.logger.warn(
      'BLOB_READ_WRITE_TOKEN not set — media rows exist in Postgres but bytes are not uploaded to Vercel Blob.',
    )
    return
  }

  payload.logger.info(
    `Blob target: store ${storeId ?? 'unknown'}, access ${getVercelBlobAccess()}, public URL ${publicUrl}`,
  )

  if (process.env.DATABASE_URI?.includes('neon.tech') && publicUrl.includes('localhost')) {
    payload.logger.warn(
      'Remote Neon DB but NEXT_PUBLIC_SERVER_URL is localhost — admin thumbnails will point at localhost until you re-seed with NEXT_PUBLIC_SERVER_URL=https://your-site.vercel.app',
    )
  }

  if (!process.env.VERCEL) {
    payload.logger.warn(
      'Seed is running locally: files upload to the Blob store in this .env token. It must be the same token configured on Vercel (vercel env pull).',
    )
  }
}

function mediaFileUrl(filename: string): string {
  return `${getServerSideURL()}/api/media/file/${encodeURIComponent(filename)}?prefix=${MEDIA_BLOB_PREFIX}`
}

export async function patchMediaAfterBlobUpload(
  payload: Payload,
  { id, filename }: { id: number | string; filename: string },
): Promise<void> {
  await payload.update({
    collection: 'media',
    id,
    data: {
      prefix: MEDIA_BLOB_PREFIX,
      url: mediaFileUrl(filename),
    },
    depth: 0,
    overrideAccess: true,
    context: SEED_CONTEXT,
  })
}

/** Idempotent: align prefix + url on all media rows (fixes admin thumbnails after seed). */
export async function syncMediaBlobMetadata(payload: Payload): Promise<number> {
  const { docs } = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 500,
    pagination: false,
    sort: 'id',
  })

  let updated = 0
  for (const doc of docs) {
    if (typeof doc.filename !== 'string' || !doc.filename) continue
    const expectedUrl = mediaFileUrl(doc.filename)
    if (doc.prefix === MEDIA_BLOB_PREFIX && doc.url === expectedUrl) continue

    await patchMediaAfterBlobUpload(payload, { id: doc.id, filename: doc.filename })
    updated += 1
  }

  if (updated > 0) {
    payload.logger.info(`Blob metadata: updated prefix/url on ${updated} media row(s).`)
  }
  return updated
}

export function isBlobSeedEnabled(): boolean {
  return Boolean(getBlobReadWriteToken())
}

export function blobStorageKey(filename: string): string {
  return mediaBlobObjectKey(filename)
}

export async function uploadBytesToBlob(
  payload: Payload,
  {
    buffer,
    filename,
    mimeType,
  }: {
    buffer: Buffer
    filename: string
    mimeType: string
  },
): Promise<void> {
  const token = getBlobReadWriteToken()
  if (!token) return

  await put(blobStorageKey(filename), buffer, {
    access: getVercelBlobAccess(),
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: BLOB_CACHE_MAX_AGE,
    contentType: mimeType,
    token,
  })
  payload.logger.info(`Blob: media/${filename}`)
}

export async function uploadFileToBlob(
  payload: Payload,
  {
    filePath,
    filename,
    mimeType,
  }: {
    filePath: string
    filename: string
    mimeType: string
  },
): Promise<void> {
  await uploadBytesToBlob(payload, {
    buffer: readFileSync(filePath),
    filename,
    mimeType,
  })
}

function buildBrochureSourceByAlt(rootDir: string): Map<string, string> {
  const picturesDir = path.resolve(rootDir, 'src/seed/assets/convention2025/pictures')
  const partnersDir = path.resolve(rootDir, 'src/seed/assets/convention2025/partners')
  const conferenceLogo = path.resolve(rootDir, 'public/brand/ffc-ricerca.png')
  const byAlt = new Map<string, string>()

  byAlt.set('FFC Ricerca', conferenceLogo)
  for (const rows of Object.values(ABSTRACT_PICTURES)) {
    for (const row of rows) {
      byAlt.set(row.caption, path.join(picturesDir, row.file))
    }
  }
  for (const partner of CONVENTION_2025_PARTNERS) {
    byAlt.set(partner.mediaAlt, path.join(partnersDir, partner.file))
  }

  return byAlt
}

/** Idempotent: (re)upload brochure assets for all matching media rows. */
export async function syncBrochureMediaToBlob(payload: Payload, rootDir: string): Promise<number> {
  if (!isBlobSeedEnabled()) {
    payload.logger.warn(
      'BLOB_READ_WRITE_TOKEN not set — media records exist but files are not on Vercel Blob.',
    )
    return 0
  }

  const byAlt = buildBrochureSourceByAlt(rootDir)
  const { docs } = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 500,
    pagination: false,
    sort: 'id',
  })

  let uploaded = 0
  for (const doc of docs) {
    if (typeof doc.filename !== 'string' || !doc.filename) continue
    const alt = typeof doc.alt === 'string' ? doc.alt.trim() : ''
    let sourcePath = alt ? byAlt.get(alt) : undefined

    if (!sourcePath && doc.filename === 'vr.png') {
      sourcePath = path.join(rootDir, 'src/seed/assets/convention2025/partners/vr.png')
    }

    if (!sourcePath || !existsSync(/* turbopackIgnore: true */ sourcePath)) continue

    const mimeType =
      typeof doc.mimeType === 'string' && doc.mimeType
        ? doc.mimeType
        : sourcePath.endsWith('.png')
          ? 'image/png'
          : 'image/jpeg'

    await uploadFileToBlob(payload, {
      filePath: sourcePath,
      filename: doc.filename,
      mimeType,
    })
    await patchMediaAfterBlobUpload(payload, { id: doc.id, filename: doc.filename })
    uploaded += 1
  }

  payload.logger.info(`Blob sync: ${uploaded} brochure media file(s) uploaded.`)
  return uploaded
}
