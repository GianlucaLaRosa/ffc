import { existsSync, readFileSync } from 'fs'
import path from 'path'

import { BlobNotFoundError, get, head } from '@vercel/blob'

import {
  getBlobReadWriteToken,
  getBlobStoreId,
  getVercelBlobAccess,
} from '@/utilities/blobAccess'
import { MEDIA_BLOB_PREFIX } from '@/utilities/mediaBlobStorage'

const CACHE_CONTROL = 'public, max-age=31536000, immutable'

function localMediaFileResponse(pathname: string): Response | null {
  if (process.env.NODE_ENV === 'production') return null

  const relativePath = pathname.replace(/^\/+/, '')
  const filePath = path.resolve(process.cwd(), relativePath)
  const mediaRoot = path.resolve(process.cwd(), 'media')
  if (!filePath.startsWith(mediaRoot) || !existsSync(/* turbopackIgnore: true */ filePath)) {
    return null
  }

  const buffer = readFileSync(filePath)
  const filename = path.basename(filePath)
  const contentType = filename.endsWith('.png')
    ? 'image/png'
    : filename.endsWith('.webp')
      ? 'image/webp'
      : 'image/jpeg'

  return new Response(buffer, {
    headers: {
      'Cache-Control': CACHE_CONTROL,
      'Content-Disposition': `inline; filename="${filename}"`,
      'Content-Type': contentType,
    },
    status: 200,
  })
}

function blobGetOptions(ifNoneMatch?: string) {
  return {
    access: getVercelBlobAccess(),
    ifNoneMatch,
    storeId: getBlobStoreId(),
    token: getBlobReadWriteToken(),
  } as const
}

export function mediaBlobPathCandidates(filename: string, prefix: string | null): string[] {
  const decoded = decodeURIComponent(filename)
  const candidates: string[] = []
  if (prefix) candidates.push(`${prefix}/${decoded}`)
  if (prefix !== '') candidates.push(decoded)
  return candidates
}

export function mediaBlobPrefixFromRequest(prefixParam: string | null): string | null {
  if (prefixParam == null || prefixParam === '') return MEDIA_BLOB_PREFIX
  return prefixParam
}

async function readBlob(pathname: string, ifNoneMatch?: string) {
  return get(pathname, blobGetOptions(ifNoneMatch))
}

export async function serveMediaBlobFile(
  filename: string,
  prefixParam: string | null,
  ifNoneMatch?: string,
): Promise<Response> {
  if (!getBlobReadWriteToken() && !process.env.VERCEL) {
    return new Response('Blob storage is not configured', { status: 503 })
  }

  const prefix = mediaBlobPrefixFromRequest(prefixParam)
  const candidates = mediaBlobPathCandidates(filename, prefix)

  let lastError: unknown
  for (const pathname of candidates) {
    try {
      const result = await readBlob(pathname, ifNoneMatch)
      if (result.statusCode === 304) {
        return new Response(null, {
          headers: {
            'Cache-Control': CACHE_CONTROL,
            ETag: result.blob.etag,
          },
          status: 304,
        })
      }

      if (result.statusCode !== 200 || !result.stream) {
        continue
      }

      return new Response(result.stream, {
        headers: {
          'Cache-Control': CACHE_CONTROL,
          'Content-Disposition': result.blob.contentDisposition,
          'Content-Type': result.blob.contentType,
          ETag: result.blob.etag,
        },
        status: 200,
      })
    } catch (err) {
      lastError = err
      const local = localMediaFileResponse(pathname)
      if (local) return local
    }
  }

  if (lastError instanceof BlobNotFoundError) {
    return new Response(null, { status: 404, statusText: 'Not Found' })
  }

  if (process.env.VERCEL) {
    console.error('serveMediaBlobFile failed', lastError)
  }

  return new Response(null, { status: 404, statusText: 'Not Found' })
}

export async function serveMediaBlobHead(
  filename: string,
  prefixParam: string | null,
): Promise<Response> {
  if (!getBlobReadWriteToken() && !process.env.VERCEL) {
    return new Response('Blob storage is not configured', { status: 503 })
  }

  const prefix = mediaBlobPrefixFromRequest(prefixParam)
  const token = getBlobReadWriteToken()
  const candidates = mediaBlobPathCandidates(filename, prefix)

  for (const pathname of candidates) {
    try {
      const meta = await head(pathname, { storeId: getBlobStoreId(), token })
      return new Response(null, {
        headers: {
          'Cache-Control': CACHE_CONTROL,
          'Content-Disposition': meta.contentDisposition,
          'Content-Length': String(meta.size),
          'Content-Type': meta.contentType,
          ETag: meta.etag,
        },
        status: 200,
      })
    } catch (err) {
      if (!(err instanceof BlobNotFoundError)) throw err
    }
  }

  return new Response(null, { status: 404, statusText: 'Not Found' })
}
