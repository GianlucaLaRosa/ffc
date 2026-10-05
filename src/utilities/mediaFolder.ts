import type { Payload, PayloadRequest } from 'payload'

export const CONFERENCE_LOGOS_FOLDER_NAME = 'Conference logos'
export const PARTNER_LOGOS_FOLDER_NAME = 'Partner logos'
export const PEOPLE_PHOTOS_FOLDER_NAME = 'People photos'
export const ABSTRACT_PICTURES_FOLDER_NAME = 'Abstract pictures'

export const MANAGED_MEDIA_FOLDER_NAMES = [
  CONFERENCE_LOGOS_FOLDER_NAME,
  PARTNER_LOGOS_FOLDER_NAME,
  PEOPLE_PHOTOS_FOLDER_NAME,
  ABSTRACT_PICTURES_FOLDER_NAME,
] as const

export const UPLOAD_FOLDER_COOKIE = 'fcr-upload-folder'

const FOLDERS_SLUG = 'payload-folders' as const

const folderIdCache = new Map<string, number>()

type EnsureArgs = {
  folderName: string
  payload: Payload
  req?: PayloadRequest
}

/**
 * Finds or creates a Media folder by name.
 */
export async function ensureMediaFolder({
  folderName,
  payload,
  req,
}: EnsureArgs): Promise<number> {
  const cached = folderIdCache.get(folderName)
  if (cached != null) return cached

  const existing = await payload.find({
    collection: FOLDERS_SLUG,
    depth: 0,
    limit: 1,
    pagination: false,
    req,
    where: {
      name: {
        equals: folderName,
      },
    },
  })

  if (existing.docs[0]?.id != null) {
    folderIdCache.set(folderName, existing.docs[0].id)
    return existing.docs[0].id
  }

  const created = await payload.create({
    collection: FOLDERS_SLUG,
    data: {
      name: folderName,
      folderType: ['media'],
    },
    req,
  })

  folderIdCache.set(folderName, created.id)
  return created.id
}

/**
 * Moves a media document into the given folder when needed.
 */
export async function assignMediaToFolder({
  folderName,
  mediaId,
  payload,
  req,
}: {
  folderName: string
  mediaId: number | string
  payload: Payload
  req?: PayloadRequest
}): Promise<void> {
  const folderId = await ensureMediaFolder({ folderName, payload, req })

  const media = await payload.findByID({
    collection: 'media',
    depth: 0,
    id: mediaId,
    req,
    select: {
      folder: true,
    },
  })

  const currentFolderId =
    media.folder == null
      ? null
      : typeof media.folder === 'object'
        ? media.folder.id
        : media.folder

  if (currentFolderId === folderId) return

  await payload.update({
    collection: 'media',
    context: {
      disableRevalidate: true,
    },
    data: {
      folder: folderId,
    },
    id: mediaId,
    req,
  })
}

export function isManagedMediaFolderName(
  value: unknown,
): value is (typeof MANAGED_MEDIA_FOLDER_NAMES)[number] {
  return (
    typeof value === 'string' &&
    (MANAGED_MEDIA_FOLDER_NAMES as readonly string[]).includes(value)
  )
}

export function folderNameFromRequest(req: PayloadRequest): string | null {
  const raw =
    typeof req.headers?.get === 'function'
      ? req.headers.get('cookie')
      : typeof (req.headers as { cookie?: string } | undefined)?.cookie ===
          'string'
        ? (req.headers as { cookie: string }).cookie
        : null

  if (!raw) return null

  for (const part of raw.split(';')) {
    const [key, ...rest] = part.trim().split('=')
    if (key !== UPLOAD_FOLDER_COOKIE) continue
    const value = decodeURIComponent(rest.join('='))
    return isManagedMediaFolderName(value) ? value : null
  }

  return null
}

export function mediaIdFromUpload(
  value: unknown,
): number | string | null {
  if (value == null) return null
  if (typeof value === 'object' && value !== null && 'id' in value) {
    return (value as { id: number | string }).id
  }
  if (typeof value === 'number' || typeof value === 'string') return value
  return null
}
