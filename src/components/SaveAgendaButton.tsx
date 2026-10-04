'use client'

import React from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import type { AgendaItem } from '@/payload-types'
import { useSavedAgenda } from '@/context/SavedAgendaContext'

export function SaveAgendaButton({ item }: { item: AgendaItem }) {
  const { isReady, isSaved, isPartiallySaved, toggleItem } = useSavedAgenda()
  const saved = isSaved(item)
  const partial = isPartiallySaved(item)

  const label = saved
    ? 'Remove from my programme'
    : partial
      ? 'Save remaining talks to my programme'
      : 'Save to my programme'

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        toggleItem(item)
      }}
      aria-pressed={saved}
      aria-label={label}
      title={label}
      disabled={!isReady}
      className={`inline-flex size-7 items-center justify-center rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
        saved
          ? 'bg-brand-soft border-brand-border text-brand-soft-fg'
          : partial
            ? 'bg-accent-soft border-accent-border text-accent-soft-fg'
            : 'bg-subtle border-line text-fg-subtle hover:text-fg hover:border-brand-border'
      }`}
    >
      {saved ? (
        <BookmarkCheck className="size-3.5" aria-hidden />
      ) : (
        <Bookmark className={`size-3.5 ${partial ? 'fill-current' : ''}`} aria-hidden />
      )}
    </button>
  )
}
