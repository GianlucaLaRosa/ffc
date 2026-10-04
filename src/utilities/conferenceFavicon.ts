import type { Metadata } from 'next'
import type { Conference, Media } from '@/payload-types'
import { mediaUrl } from '@/utilities/conferenceUi'

const FALLBACK_ICON = '/logo.png'

export function conferenceFaviconIcons(
  logo: Conference['logo'] | Media | null | undefined,
): NonNullable<Metadata['icons']> {
  const media = typeof logo === 'object' && logo ? logo : null
  const url = mediaUrl(media) || FALLBACK_ICON
  const type = media?.mimeType ?? undefined

  return {
    icon: [{ url, type }],
    apple: [{ url: '/icons/pwa/192', sizes: '192x192', type: 'image/png' }],
  }
}
