'use client'

import React from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import type { Abstract, AgendaItem } from '@/payload-types'
import { useSavedAgenda } from '@/context/SavedAgendaContext'
import {
  isSaveableSession,
  toSavedAbstract,
  toSavedAppendixAbstract,
  toSavedSession,
  type SavedAgendaItem,
} from '@/utilities/savedAgenda'

const buttonClass = (saved: boolean, inline?: boolean) =>
  `inline-flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
    inline
      ? `size-9 shrink-0 rounded-md ${saved ? 'text-brand-soft-fg hover:bg-brand-soft/80' : 'text-fg-subtle hover:text-fg hover:bg-subtle'}`
      : `size-11 sm:size-7 rounded-lg border ${
          saved
            ? 'bg-brand-soft border-brand-border text-brand-soft-fg'
            : 'bg-subtle border-line text-fg-subtle hover:text-fg hover:border-brand-border'
        }`
  }`

function BookmarkToggle({
  entry,
  labelSaved,
  labelAdd,
  inline = false,
}: {
  entry: SavedAgendaItem
  labelSaved: string
  labelAdd: string
  inline?: boolean
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
      className={buttonClass(saved, inline)}
    >
      {saved ? (
        <BookmarkCheck className={inline ? 'size-4' : 'size-3.5'} aria-hidden />
      ) : (
        <Bookmark className={inline ? 'size-4' : 'size-3.5'} aria-hidden />
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
  inline = false,
}: {
  abstract: Abstract
  session: AgendaItem
  inline?: boolean
}) {
  return (
    <BookmarkToggle
      entry={toSavedAbstract(abstract, session)}
      labelSaved="Remove abstract from my programme"
      labelAdd="Save abstract to my programme"
      inline={inline}
    />
  )
}

export function SaveAppendixAbstractButton({
  abstract,
  inline = false,
}: {
  abstract: Abstract
  inline?: boolean
}) {
  return (
    <BookmarkToggle
      entry={toSavedAppendixAbstract(abstract)}
      labelSaved="Remove abstract from my programme"
      labelAdd="Save abstract to my programme"
      inline={inline}
    />
  )
}
