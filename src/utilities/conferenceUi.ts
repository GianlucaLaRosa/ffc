import type { Abstract, ConferenceDay, Media, Person } from '@/payload-types'
import {
  formatConferenceDateRange,
  formatConferenceDayTitle,
} from '@/utilities/conferenceTime'

export function joinDocs<T>(join: { docs?: (number | T)[] } | null | undefined): T[] {
  if (!join?.docs) return []
  return join.docs.filter((doc): doc is T => typeof doc === 'object' && doc !== null)
}

export function joinDocIds(
  join: { docs?: (number | string | { id?: number | string })[] } | null | undefined,
): string[] {
  if (!join?.docs) return []
  return join.docs.flatMap((doc) => {
    if (typeof doc === 'object' && doc && doc.id != null) return [String(doc.id)]
    if (typeof doc === 'number' || typeof doc === 'string') return [String(doc)]
    return []
  })
}

export function mediaUrl(media: number | Media | null | undefined): string | null {
  if (!media || typeof media !== 'object') return null
  if (typeof media.url === 'string' && media.url) return media.url
  if (typeof media.filename === 'string' && media.filename) {
    return `/api/media/file/${media.filename}`
  }
  return null
}

export function personGivenAndFamilyName(
  person: Person | number | null | undefined,
): string {
  if (!person || typeof person !== 'object') return ''
  const name = [person.firstName, person.lastName]
    .map((part) => (typeof part === 'string' ? part.trim() : ''))
    .filter(Boolean)
    .join(' ')
  return name || person.fullName || ''
}

export function personName(person: Person | number | null | undefined): string {
  if (!person || typeof person !== 'object') return ''
  if (person.fullName) return person.fullName
  return personGivenAndFamilyName(person)
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

export type AbstractAppendixRow = NonNullable<Abstract['appendices']>[number]

/** Published appendix rows from the abstract CMS Appendix tab. */
export function abstractAppendixRows(abstract: Abstract): AbstractAppendixRow[] {
  if (!Array.isArray(abstract.appendices)) return []
  return abstract.appendices.filter((row) => {
    const title = typeof row.title === 'string' ? row.title.trim() : ''
    return Boolean(title || row.body)
  })
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

function abstractPictureSlides(abstract: Abstract): AbstractGallerySlide[] {
  const pictures = Array.isArray(abstract.picture) ? abstract.picture : []
  const slides: AbstractGallerySlide[] = []

  pictures.forEach((item, index) => {
    const image = typeof item.image === 'object' ? item.image : null
    const url = mediaUrl(image)
    if (!url) return
    const caption =
      item.description?.trim() ||
      (typeof image?.alt === 'string' ? image.alt.trim() : '') ||
      ''
    const alt = caption || 'Abstract figure'
    slides.push({
      key: `picture-${item.id || index}`,
      url,
      caption,
      alt,
    })
  })

  return slides
}

function abstractAuthorSlides(
  abstract: Abstract,
  skipUrls: Set<string>,
): AbstractGallerySlide[] {
  const slides: AbstractGallerySlide[] = []
  const seen = new Set(skipUrls)

  abstractAuthors(abstract).forEach((row) => {
    const url = mediaUrl(row.person.photo)
    if (!url || seen.has(url)) return
    seen.add(url)
    const name = personGivenAndFamilyName(row.person)
    if (!name) return
    slides.push({
      key: `author-${row.person.id}`,
      url,
      caption: name,
      alt: name,
    })
  })

  return slides
}

/** First Pictures row, for the public card cover. */
export function abstractCoverSlide(abstract: Abstract): AbstractGallerySlide | null {
  return abstractPictureSlides(abstract)[0] ?? null
}

/**
 * Pictures in CMS order, then author portraits in the same order as Authors.
 */
export function abstractGallerySlides(abstract: Abstract): AbstractGallerySlide[] {
  const pictures = abstractPictureSlides(abstract)
  const skipUrls = new Set(pictures.map((slide) => slide.url))
  return [...pictures, ...abstractAuthorSlides(abstract, skipUrls)]
}

export function abstractAuthorSlideIndex(
  slides: AbstractGallerySlide[],
  personId: number | string,
): number | null {
  const index = slides.findIndex((slide) => slide.key === `author-${personId}`)
  return index >= 0 ? index : null
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
