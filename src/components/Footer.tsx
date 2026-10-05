import React from 'react'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { SessionIcon } from './IconRenderer'
import { mediaUrl } from '@/utilities/conferenceUi'
import type { Footer as FooterGlobal, Media } from '@/payload-types'

export interface FooterProps {
  editionYear?: number | null
  footer?: FooterGlobal | null
}

function OrgLink({
  label,
  url,
  icon,
}: {
  label?: string | null
  url?: string | null
  icon?: FooterGlobal['structure']['icon']
}) {
  if (!label && !url) return null
  const content = (
    <span className="inline-flex items-center gap-1.5 font-medium text-fg-muted hover:text-brand-soft-fg transition-colors">
      {icon?.name && <SessionIcon name={icon} className="w-3.5 h-3.5" />}
      <span>{label || url}</span>
    </span>
  )
  if (!url) return content
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  )
}

function partnerImage(value: number | Media | null | undefined): Media | null {
  return value && typeof value === 'object' ? value : null
}

function PartnerLogo({
  image,
  url,
  alt,
}: {
  image?: number | Media | null
  url?: string | null
  alt?: string | null
}) {
  const media = partnerImage(image)
  const src = mediaUrl(media)
  if (!src) return null

  const altText = alt?.trim() || media?.alt?.trim() || ''
  const logo = (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={altText} className="h-9 sm:h-10 w-auto max-w-[140px] object-contain" />
  )

  if (!url?.trim()) return logo

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center opacity-80 hover:opacity-100 transition-opacity"
    >
      {logo}
    </a>
  )
}

export function Footer({ editionYear = 2026, footer }: FooterProps) {
  const partners = (footer?.partners ?? []).filter((row) => partnerImage(row.image))
  const credits = (footer?.credits ?? []).filter(
    (row) => row.role?.trim() && row.name?.trim(),
  )

  return (
    <footer className="border-t border-line bg-surface py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] text-xs text-fg-subtle">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {(footer?.structure?.label || footer?.delegation?.label) && (
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <OrgLink
              icon={footer?.structure?.icon}
              label={footer?.structure?.label}
              url={footer?.structure?.url}
            />
            <OrgLink
              icon={footer?.delegation?.icon}
              label={footer?.delegation?.label}
              url={footer?.delegation?.url}
            />
          </div>
        )}

        {partners.length > 0 && (
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
            {partners.map((partner) => (
              <PartnerLogo
                key={partner.id ?? `${partner.url}-${partner.alt}`}
                image={partner.image}
                url={partner.url}
                alt={partner.alt}
              />
            ))}
          </div>
        )}

        {credits.length > 0 && (
          <ul className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-1 text-fg-muted">
            {credits.map((credit) => (
              <li key={credit.id ?? `${credit.role}-${credit.name}`}>
                <span className="font-medium">{credit.role}</span>
                <span className="text-fg-subtle"> · {credit.name}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-soft text-brand-soft-fg border border-brand-border/60 font-medium">
            <ShieldCheck className="w-4 h-4 text-brand shrink-0" />
            <span>Cookie-Free &amp; Privacy-First Platform {editionYear ? `· ${editionYear}` : ''}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6">
            <Link
              href="/cookie-policy"
              prefetch={false}
              className="font-medium text-fg-muted hover:text-brand-soft-fg transition-colors"
            >
              {footer?.cookiePolicy?.title?.trim() || 'Cookie Policy'}
            </Link>
            <Link
              href="/privacy"
              prefetch={false}
              className="font-medium text-fg-muted hover:text-brand-soft-fg transition-colors"
            >
              {footer?.privacyPolicy?.title?.trim() || 'Privacy Policy'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
