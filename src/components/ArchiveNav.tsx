'use client'

import React from 'react'
import Link from 'next/link'
import { Archive, ChevronDown } from 'lucide-react'
import { conferencePublicPath } from '@/utilities/conferenceRoutes'
import type { ArchivedEditionLink } from '@/utilities/getConferenceEdition'

const triggerClassName =
  'px-3.5 py-2 rounded-lg text-sm font-semibold text-fg-muted hover:text-brand-soft-fg hover:bg-brand-soft/70 transition-colors flex items-center gap-2 cursor-pointer list-none [&::-webkit-details-marker]:hidden'

function editionHref(edition: ArchivedEditionLink) {
  return conferencePublicPath({ slug: edition.slug, publicArchive: true }) ?? `/archive/${edition.slug}`
}

function editionLabel(edition: ArchivedEditionLink) {
  if (edition.year != null) return `${edition.year} · ${edition.title}`
  return edition.title
}

export function ArchiveNav({
  editions,
  currentSlug,
  variant,
  onNavigate,
}: {
  editions: ArchivedEditionLink[]
  currentSlug?: string | null
  variant: 'desktop' | 'mobile'
  onNavigate?: () => void
}) {
  if (editions.length === 0) return null

  const links = editions.map((edition) => {
    const isCurrent = Boolean(currentSlug && edition.slug === currentSlug)
    return (
      <Link
        key={edition.slug}
        href={editionHref(edition)}
        aria-current={isCurrent ? 'page' : undefined}
        onClick={onNavigate}
        className={`block rounded-lg px-3 py-3 min-h-11 text-sm font-semibold transition-colors ${
          isCurrent
            ? 'bg-brand-soft text-brand-soft-fg'
            : 'text-fg hover:bg-brand-soft/70 hover:text-brand-soft-fg'
        }`}
      >
        {editionLabel(edition)}
      </Link>
    )
  })

  if (variant === 'mobile') {
    return (
      <div className="flex flex-col gap-1 pt-1">
        <p className="flex items-center gap-3 px-4 py-1 text-xs font-bold uppercase tracking-widest text-fg-subtle">
          <Archive className="w-4 h-4 text-brand" aria-hidden />
          Archive
        </p>
        <div className="flex flex-col gap-1 pl-2">{links}</div>
      </div>
    )
  }

  return (
    <details className="relative group">
      <summary className={triggerClassName}>
        <Archive className="w-4 h-4 text-brand" aria-hidden />
        <span>Archive</span>
        <ChevronDown className="w-3.5 h-3.5 transition-transform group-open:rotate-180" aria-hidden />
      </summary>
      <div
        role="menu"
        aria-label="Archived editions"
        className="absolute right-0 top-full mt-2 w-[min(20rem,calc(100vw-2rem))] max-h-[min(24rem,70vh)] overflow-y-auto rounded-2xl border border-line bg-surface p-2 shadow-lg z-50"
      >
        {links}
      </div>
    </details>
  )
}
