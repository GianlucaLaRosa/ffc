import React from 'react'
import { mediaUrl } from '@/utilities/conferenceUi'
import type { Footer as FooterGlobal, Media } from '@/payload-types'

export function partnerImage(value: number | Media | null | undefined): Media | null {
  return value && typeof value === 'object' ? value : null
}

export function footerPartners(footer?: FooterGlobal | null) {
  return (footer?.partners ?? []).filter((row) => partnerImage(row.image))
}

export function PartnerLogo({
  image,
  url,
  alt,
  className = 'h-10 sm:h-12 w-auto max-w-[160px] object-contain',
}: {
  image?: number | Media | null
  url?: string | null
  alt?: string | null
  className?: string
}) {
  const media = partnerImage(image)
  const src = mediaUrl(media)
  if (!src) return null

  const altText = alt?.trim() || media?.alt?.trim() || ''
  const logo = (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={altText} className={className} />
  )

  if (!url?.trim()) return logo

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center opacity-85 hover:opacity-100 transition-opacity"
    >
      {logo}
    </a>
  )
}
