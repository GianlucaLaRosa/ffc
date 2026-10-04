import type { Abstract, ConferenceDay, Media, Person } from '@/payload-types'
import {
  formatConferenceDateRange,
  formatConferenceDayTitle,
} from '@/utilities/conferenceTime'

export function joinDocs<T>(join: { docs?: (number | T)[] } | null | undefined): T[] {
  if (!join?.docs) return []
  return join.docs.filter((doc): doc is T => typeof doc === 'object' && doc !== null)
}

export function mediaUrl(media: number | Media | null | undefined): string | null {
  if (!media || typeof media !== 'object') return null
  if (typeof media.url === 'string' && media.url) return media.url
  if (typeof media.filename === 'string' && media.filename) {
    return `/api/media/file/${media.filename}`
  }
  return null
}

export function personName(person: Person | number | null | undefined): string {
  if (!person || typeof person !== 'object') return ''
  if (person.fullName) return person.fullName
  return [person.firstName, person.lastName].filter(Boolean).join(' ')
}

export function personInstitution(person: Person | number | null | undefined): string {
  if (!person || typeof person !== 'object') return ''
  if (person.institution && typeof person.institution === 'object') {
    return person.institution.name
  }
  return ''
}

export function abstractStatusLabel(status: Abstract['status']): string {
  if (!status || typeof status !== 'object') return ''
  return status.status
}

export function abstractAuthors(abstract: Abstract): Array<{
  person: Person
  role: string
  isSpeaker: boolean
}> {
  if (!Array.isArray(abstract.authors)) return []
  return abstract.authors.flatMap((row) => {
    if (!row.person || typeof row.person !== 'object') return []
    return [
      {
        person: row.person,
        role: row.role,
        isSpeaker: Boolean(row.isSpeaker),
      },
    ]
  })
}

export type AbstractGallerySlide = {
  key: string
  url: string
  caption: string
  alt: string
}

/** Abstract photos first, then speaker photos in UI order. Team members are excluded. */
export function abstractGallerySlides(abstract: Abstract): AbstractGallerySlide[] {
  const slides: AbstractGallerySlide[] = []

  const pictures = Array.isArray(abstract.picture) ? abstract.picture : []
  pictures.forEach((item, index) => {
    const image = typeof item.image === 'object' ? item.image : null
    const url = mediaUrl(image)
    if (!url) return
    const caption = item.description?.trim() || ''
    const alt = caption || image?.alt || 'Abstract figure'
    slides.push({
      key: `picture-${item.id || index}`,
      url,
      caption,
      alt,
    })
  })

  for (const row of abstractAuthors(abstract)) {
    if (!row.isSpeaker || row.role === 'teamMember') continue
    const url = mediaUrl(row.person.photo)
    if (!url) continue
    const name = personName(row.person)
    slides.push({
      key: `speaker-${row.person.id}`,
      url,
      caption: name,
      alt: name || 'Speaker photo',
    })
  }

  return slides
}

export function formatDayTitle(day: ConferenceDay): string {
  return formatConferenceDayTitle(day.date)
}

export function formatDateRange(days: ConferenceDay[]): string {
  return formatConferenceDateRange(days.map((day) => day.date))
}

export const AUTHOR_ROLE_LABEL: Record<string, string> = {
  primaryInvestigator: 'Primary Investigator',
  partner: 'Partner',
  collaborator: 'Collaborator',
  teamMember: 'Team Member',
}

export type AgendaIconValue =
  | string
  | {
      name?: string | null
      provider?: string
      definition?: {
        viewBox: string
        attributes?: Record<string, string>
        nodes: Array<{
          tag: string
          attributes?: Record<string, string>
          children?: unknown[]
        }>
      }
    }
  | null
  | undefined
