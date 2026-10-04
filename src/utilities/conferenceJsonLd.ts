import type { Conference, ConferenceDay } from '@/payload-types'
import { conferenceDateTimeIso } from '@/utilities/conferenceTime'
import { getServerSideURL } from '@/utilities/getURL'
import { mediaUrl } from '@/utilities/conferenceUi'

const VENUE_FACT_LABELS = new Set([
  'city',
  'città',
  'country',
  'paese',
  'address',
  'indirizzo',
  'venue',
  'sede',
  'location',
  'luogo',
  'date',
  'dates',
  'quando',
])

function absoluteUrl(pathOrUrl: string | null): string | undefined {
  if (!pathOrUrl) return undefined
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) return pathOrUrl
  return `${getServerSideURL()}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`
}

export function conferenceJsonLd({
  conference,
  days,
  canonicalPath,
}: {
  conference: Conference
  days: ConferenceDay[]
  canonicalPath: string
}) {
  const sortedDays = [...days].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )
  const first = sortedDays[0]
  const last = sortedDays[sortedDays.length - 1]
  const startDate = first ? conferenceDateTimeIso(first.date, first.startTime) : null
  const endDate = last ? conferenceDateTimeIso(last.date, last.endTime) : startDate

  const name = conference.geo?.primaryEntity?.trim() || conference.title || 'Conference'
  const description =
    conference.geo?.summary?.trim() || conference.meta?.description?.trim() || undefined

  const place: Record<string, unknown> = {
    '@type': 'Place',
    name: conference.city,
    address: {
      '@type': 'PostalAddress',
      streetAddress: conference.address,
      addressLocality: conference.city,
      addressCountry: conference.country,
    },
  }

  if (typeof conference.latitude === 'number' && typeof conference.longitude === 'number') {
    place.geo = {
      '@type': 'GeoCoordinates',
      latitude: conference.latitude,
      longitude: conference.longitude,
    }
  }

  const extraFacts = (conference.geo?.keyFacts ?? []).filter((fact) => {
    const label = fact.label?.trim().toLowerCase()
    if (!label || !fact.value?.trim()) return false
    return !VENUE_FACT_LABELS.has(label)
  })

  const image = absoluteUrl(mediaUrl(conference.meta?.image) || mediaUrl(conference.logo))

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    url: absoluteUrl(canonicalPath),
    dateModified: conference.updatedAt,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: place,
  }

  if (description) jsonLd.description = description
  if (startDate) jsonLd.startDate = startDate
  if (endDate) jsonLd.endDate = endDate
  if (image) jsonLd.image = image
  if (extraFacts.length > 0) {
    jsonLd.additionalProperty = extraFacts.map((fact) => ({
      '@type': 'PropertyValue',
      name: fact.label,
      value: fact.value,
    }))
  }

  return jsonLd
}
