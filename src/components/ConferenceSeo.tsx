import React from 'react'
import type { Metadata } from 'next'
import type { Conference, Media } from '@/payload-types'
import { mediaUrl } from '@/utilities/conferenceUi'
import { getServerSideURL } from '@/utilities/getURL'

export function conferenceMetadata({
  conference,
  canonicalPath,
}: {
  conference: Conference
  canonicalPath: string
}): Metadata {
  const title = conference.meta?.title?.trim() || `${conference.title || 'Conference'} | FFC`
  const description =
    conference.meta?.description?.trim() || conference.geo?.summary?.trim() || undefined
  const image = mediaUrl(conference.meta?.image as number | Media | null)
  const canonical = `${getServerSideURL()}${canonicalPath === '/' ? '' : canonicalPath}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      images: image ? [{ url: image }] : undefined,
    },
  }
}

export function ConferenceJsonLd({
  jsonLd,
}: {
  jsonLd: Record<string, unknown>
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
