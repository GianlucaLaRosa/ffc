'use client'

import React from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import type { Abstract, AgendaItem } from '@/payload-types'
import { useSavedAgenda } from '@/context/SavedAgendaContext'
import {
  isSaveableSession,
  toSavedAbstract,
  toSavedSession,
  type SavedAgendaItem,
} from '@/utilities/savedAgenda'

const buttonClass = (saved: boolean) =>
  `inline-flex size-11 sm:size-7 items-center justify-center rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
    saved
      ? 'bg-brand-soft border-brand-border text-brand-soft-fg'
      : 'bg-subtle border-line text-fg-subtle hover:text-fg hover:border-brand-border'
  }`

function BookmarkToggle({
  entry,
  labelSaved,
  labelAdd,
}: {
  entry: SavedAgendaItem
  labelSaved: string
  labelAdd: string
}) {
  const { isReady, isSaved, toggleSaved } = useSavedAgenda()
  const saved = isSaved(entry.id)
  const label = saved ? labelSaved : labelAdd

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        toggleSaved(entry)
      }}
      aria-pressed={saved}
      aria-label={label}
      title={label}
      disabled={!isReady}
      className={buttonClass(saved)}
    >
      {saved ? (
        <BookmarkCheck className="size-3.5" aria-hidden />
      ) : (
        <Bookmark className="size-3.5" aria-hidden />
      )}
    </button>
  )
}

export function SaveAgendaButton({ item }: { item: AgendaItem }) {
  if (!isSaveableSession(item)) return null
  return (
    <BookmarkToggle
      entry={toSavedSession(item)}
      labelSaved="Remove from my programme"
      labelAdd="Save to my programme"
    />
  )
}

export function SaveAbstractButton({
  abstract,
  session,
}: {
  abstract: Abstract
  session: AgendaItem
}) {
  return (
    <BookmarkToggle
      entry={toSavedAbstract(abstract, session)}
      labelSaved="Remove abstract from my programme"
      labelAdd="Save abstract to my programme"
    />
  )
}
