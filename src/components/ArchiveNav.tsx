'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Archive } from 'lucide-react'
import type { ArchivedEditionLink } from '@/utilities/getConferenceEdition'

export function ArchiveNav({
  editions,
  variant,
  onNavigate,
}: {
  editions: ArchivedEditionLink[]
  variant: 'desktop' | 'mobile'
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  if (editions.length === 0) return null

  const isCurrent = pathname === '/archive' || pathname.startsWith('/archive/')
  const className =
    variant === 'mobile'
      ? 'flex items-center gap-3 px-4 py-3 min-h-11 rounded-lg text-sm font-semibold text-fg hover:bg-brand-soft hover:text-brand-soft-fg'
      : 'px-3.5 py-2 rounded-lg text-sm font-semibold text-fg-muted hover:text-brand-soft-fg hover:bg-brand-soft/70 transition-colors flex items-center gap-2'

  return (
    <Link
      href="/archive"
      aria-current={isCurrent ? 'page' : undefined}
      onClick={onNavigate}
      className={`${className}${isCurrent ? ' bg-brand-soft text-brand-soft-fg' : ''}`}
    >
      <Archive className="w-4 h-4 text-brand" aria-hidden />
      <span>Archive</span>
    </Link>
  )
}
