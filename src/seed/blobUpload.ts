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
import { getVercelBlobAccess } from '@/utilities/blobAccess'
import { mediaBlobObjectKey } from '@/utilities/mediaBlobStorage'

const BLOB_CACHE_MAX_AGE = 60 * 60 * 24 * 365

export function isBlobSeedEnabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim())
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
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim()
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

    if (!sourcePath || !existsSync(sourcePath)) continue

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
    uploaded += 1
  }

  payload.logger.info(`Blob sync: ${uploaded} brochure media file(s) uploaded.`)
  return uploaded
}
