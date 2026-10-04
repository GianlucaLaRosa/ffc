import { cssHex } from '@/utilities/conferenceTheme'
import { getActiveConferenceBrand, getActiveConferenceId } from '@/utilities/getConferenceEdition'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function conferenceWebManifest() {
  const { id } = await getActiveConferenceId()
  const { primaryColor } = await getActiveConferenceBrand()
  let name = 'FFC Scientific Conference'
  let shortName = 'FFC Conf'

  if (id) {
    const payload = await getPayload({ config: configPromise })
    try {
      const conference = await payload.findByID({
        collection: 'conferences',
        id,
        depth: 0,
        draft: false,
        select: {
          title: true,
          year: true,
          _status: true,
        },
      })
      if (!conference._status || conference._status === 'published') {
        const year = conference.year ? String(conference.year) : ''
        name = conference.title?.trim() || name
        shortName = year ? `FFC ${year}` : shortName
      }
    } catch {
      // Keep fallback names.
    }
  }

  return {
    id: '/',
    name,
    short_name: shortName,
    description: 'Official programme, abstracts, and venue for the FFC Scientific Conference.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    display_override: ['standalone', 'minimal-ui', 'browser'],
    background_color: '#ffffff',
    theme_color: cssHex(primaryColor),
    lang: 'en',
    dir: 'ltr',
    categories: ['education', 'lifestyle'],
    icons: [
      {
        src: '/icons/pwa/192',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/pwa/512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/pwa/192',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/pwa/512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
