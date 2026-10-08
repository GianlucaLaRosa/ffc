import { readFileSync } from 'fs'
import path from 'path'
import type { Payload } from 'payload'

import { patchMediaAfterBlobUpload, uploadBytesToBlob, uploadFileToBlob } from '@/seed/blobUpload'
import type { SeedPartnerLogo } from '@/seed/data/convention2025'
import type { SeedAbstractPicture } from '@/seed/data/convention2025AbstractPictures'
import { CONFERENCE_TIME_ZONE } from '@/utilities/conferenceTime'
import { PARTNER_LOGOS_FOLDER_NAME, ensureMediaFolder } from '@/utilities/mediaFolder'

const SEED_CONTEXT = { disableRevalidate: true } as const

export const lucide = (name: string) => ({ provider: 'lucide', name })

/** Instant whose Europe/Rome wall clock is `hours:minutes` (Payload time-only). */
export function wallClockTime(hours: number, minutes = 0): string {
  const desiredUtc = Date.UTC(1970, 0, 1, hours, minutes, 0)
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: CONFERENCE_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(desiredUtc))

  const shownH = Number(parts.find((part) => part.type === 'hour')?.value ?? hours)
  const shownM = Number(parts.find((part) => part.type === 'minute')?.value ?? minutes)
  const deltaMin = shownH * 60 + shownM - (hours * 60 + minutes)
  return new Date(desiredUtc - deltaMin * 60_000).toISOString()
}

/** Noon UTC so the calendar day is stable in Europe/Rome. */
export function calendarDay(isoDate: string): string {
  return `${isoDate}T12:00:00.000Z`
}

export function splitPersonName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) return { firstName: parts[0]!, lastName: parts[0]! }
  return { firstName: parts.slice(0, -1).join(' '), lastName: parts.at(-1)! }
}

export async function publishCreate<T extends string>(
  payload: Payload,
  collection: T,
  data: Record<string, unknown>,
) {
  return payload.create({
    collection,
    data: { ...data, _status: 'published' },
    depth: 0,
    draft: false,
    overrideAccess: true,
    context: SEED_CONTEXT,
  } as Parameters<Payload['create']>[0])
}

export async function findCountryId(payload: Payload, name: string): Promise<number> {
  const { docs } = await payload.find({
    collection: 'countries',
    depth: 0,
    limit: 1,
    pagination: false,
    where: { name: { equals: name } },
  })
  const id = docs[0]?.id
  if (id == null) throw new Error(`Country not found: ${name}`)
  return id as number
}

export async function findRegionId(payload: Payload, name: string): Promise<number> {
  const { docs } = await payload.find({
    collection: 'italian-regions',
    depth: 0,
    limit: 1,
    pagination: false,
    where: { name: { equals: name } },
  })
  const id = docs[0]?.id
  if (id == null) throw new Error(`Italian region not found: ${name}`)
  return id as number
}

export async function findStatusId(
  payload: Payload,
  status: 'new' | 'ongoing' | 'concluded',
): Promise<number> {
  const { docs } = await payload.find({
    collection: 'abstract-statuses',
    depth: 0,
    limit: 1,
    pagination: false,
    where: { status: { equals: status } },
  })
  const id = docs[0]?.id
  if (id == null) throw new Error(`Abstract status not found: ${status}`)
  return id as number
}

export async function findOrCreateInstitution({
  payload,
  name,
  countryId,
  regionId,
}: {
  payload: Payload
  name: string
  countryId: number
  regionId?: number
}): Promise<number> {
  const { docs } = await payload.find({
    collection: 'institutions',
    depth: 0,
    limit: 1,
    pagination: false,
    where: { name: { equals: name } },
  })
  if (docs[0]?.id != null) return docs[0].id as number

  const created = await payload.create({
    collection: 'institutions',
    depth: 0,
    overrideAccess: true,
    context: SEED_CONTEXT,
    data: {
      name,
      country: countryId,
      ...(regionId != null ? { region: regionId } : {}),
    },
  })
  return created.id as number
}

export async function findOrCreatePerson({
  payload,
  firstName,
  lastName,
  institutionId,
}: {
  payload: Payload
  firstName: string
  lastName: string
  institutionId?: number
}): Promise<number> {
  const { docs } = await payload.find({
    collection: 'people',
    depth: 0,
    limit: 1,
    pagination: false,
    where: {
      and: [{ firstName: { equals: firstName } }, { lastName: { equals: lastName } }],
    },
  })
  if (docs[0]?.id != null) {
    const existingId = docs[0].id as number
    if (institutionId != null && docs[0].institution == null) {
      await payload.update({
        collection: 'people',
        id: existingId,
        depth: 0,
        overrideAccess: true,
        context: SEED_CONTEXT,
        data: { institution: institutionId },
      })
    }
    return existingId
  }

  const created = await payload.create({
    collection: 'people',
    depth: 0,
    overrideAccess: true,
    context: SEED_CONTEXT,
    data: {
      firstName,
      lastName,
      ...(institutionId != null ? { institution: institutionId } : {}),
    },
  })
  return created.id as number
}

function mimeTypeForSeedFile(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  if (ext === '.png') return 'image/png'
  if (ext === '.webp') return 'image/webp'
  if (ext === '.gif') return 'image/gif'
  if (ext === '.svg') return 'image/svg+xml'
  return 'image/jpeg'
}

export async function createSeedMedia(
  payload: Payload,
  {
    alt,
    filePath,
    folderId,
  }: {
    alt: string
    filePath: string
    folderId: number
  },
): Promise<number> {
  const buffer = readFileSync(filePath)
  const name = path.basename(filePath)
  const mimeType = mimeTypeForSeedFile(filePath)
  const created = await payload.create({
    collection: 'media',
    depth: 0,
    overrideAccess: true,
    context: SEED_CONTEXT,
    data: {
      alt,
      folder: folderId,
    },
    file: {
      data: buffer,
      mimetype: mimeType,
      name,
      size: buffer.length,
    },
  })
  if (typeof created.filename === 'string' && created.filename) {
    await uploadBytesToBlob(payload, {
      buffer,
      filename: created.filename,
      mimeType,
    })
    await patchMediaAfterBlobUpload(payload, {
      id: created.id,
      filename: created.filename,
    })
  }
  return created.id as number
}

export async function seedAbstractPictureRows(
  payload: Payload,
  {
    folderId,
    picturesDir,
    pictures,
  }: {
    folderId: number
    picturesDir: string
    pictures: SeedAbstractPicture[]
  },
): Promise<Array<{ image: number; description: string }>> {
  const rows: Array<{ image: number; description: string }> = []
  for (const picture of pictures) {
    const image = await createSeedMedia(payload, {
      alt: picture.caption,
      filePath: path.join(picturesDir, picture.file),
      folderId,
    })
    rows.push({ image, description: picture.caption })
  }
  return rows
}

export async function seedPartnerLogos({
  payload,
  partners,
  assetsDir,
}: {
  payload: Payload
  partners: readonly SeedPartnerLogo[]
  assetsDir: string
}): Promise<Array<{ image: number; url: string; alt: string }>> {
  const folderId = await ensureMediaFolder({
    folderName: PARTNER_LOGOS_FOLDER_NAME,
    payload,
  })

  const rows: Array<{ image: number; url: string; alt: string }> = []

  for (const partner of partners) {
    const { docs } = await payload.find({
      collection: 'media',
      depth: 0,
      limit: 1,
      pagination: false,
      where: { filename: { equals: partner.file } },
    })

    let imageId = docs[0]?.id

    if (imageId == null) {
      const partnerPath = path.join(assetsDir, partner.file)
      const buffer = readFileSync(partnerPath)
      const mimeType = mimeTypeForSeedFile(partnerPath)
      const created = await payload.create({
        collection: 'media',
        depth: 0,
        overrideAccess: true,
        context: SEED_CONTEXT,
        data: {
          alt: partner.mediaAlt,
          folder: folderId,
        },
        file: {
          data: buffer,
          mimetype: mimeType,
          name: partner.file,
          size: buffer.length,
        },
      })
      if (typeof created.filename === 'string' && created.filename) {
        await uploadBytesToBlob(payload, {
          buffer,
          filename: created.filename,
          mimeType,
        })
        await patchMediaAfterBlobUpload(payload, {
          id: created.id,
          filename: created.filename,
        })
      }
      imageId = created.id
    }

    rows.push({
      image: imageId,
      url: partner.url,
      alt: partner.alt,
    })
  }

  return rows
}
