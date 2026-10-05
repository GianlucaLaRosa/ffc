import type { Payload } from 'payload'

import { CONFERENCE_TIME_ZONE } from '@/utilities/conferenceTime'

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
  if (docs[0]?.id != null) return docs[0].id as number

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
