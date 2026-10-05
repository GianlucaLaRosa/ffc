import React from 'react'
import Link from 'next/link'
import { Archive, ArrowRight } from 'lucide-react'

export function ArchivedEditionBanner({ year }: { year?: number | null }) {
  return (
    <div className="border-b border-brand-border/70 bg-brand-soft text-brand-soft-fg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="inline-flex items-center gap-2 text-sm font-semibold">
          <Archive className="w-4 h-4 text-brand shrink-0" aria-hidden />
          <span>
            Archived edition{year != null ? ` · ${year}` : ''}
            <span className="font-medium text-fg-muted"> — not the current conference</span>
          </span>
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline min-h-11 sm:min-h-0"
        >
          Open current edition
          <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
      </div>
    </div>
  )
}
