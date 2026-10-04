import type { Abstract, ConferenceDay, Media, Person } from '@/payload-types'

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

export function formatDayTitle(day: ConferenceDay): string {
  try {
    return new Date(day.date).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return 'Conference day'
  }
}

export function formatDateRange(days: ConferenceDay[]): string {
  if (days.length === 0) return ''
  const dates = days
    .map((d) => new Date(d.date))
    .filter((d) => !Number.isNaN(d.getTime()))
    .sort((a, b) => a.getTime() - b.getTime())
  if (dates.length === 0) return ''
  const start = dates[0]
  const end = dates[dates.length - 1]
  const startDay = start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const endDay = end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  if (start.toDateString() === end.toDateString()) return endDay
  return `${startDay} – ${endDay}`
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
