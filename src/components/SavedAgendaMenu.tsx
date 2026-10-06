'use client'

import React, { useEffect, useId, useRef, useState } from 'react'
import { Bell, Bookmark, BookmarkCheck, Clock, X } from 'lucide-react'
import { useSavedAgenda } from '@/context/SavedAgendaContext'
import { formatConferenceDateShort, formatConferenceTime } from '@/utilities/conferenceTime'
import { scrollToAppendixAbstract } from '@/utilities/appendixNavigation'
import { APPENDIX_AGENDA_ID, isHappeningNow, isStartingSoon } from '@/utilities/savedAgenda'

export function SavedAgendaMenu() {
  const {
    items,
    now,
    currentSaved,
    upcomingSaved,
    isReady,
    notificationState,
    notificationsAvailable,
    iPhoneInstallHint,
    leadMinutes,
    conferenceUpdates,
    removeItem,
    focusItem,
    enableNotifications,
    setConferenceUpdates,
  } = useSavedAgenda()
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const savedCount = isReady ? items.length : 0
  const hasSaved = savedCount > 0
  const hasAlert = Boolean(currentSaved || upcomingSaved)
  const buttonLabel = programmeButtonLabel({
    savedCount,
    isReady,
    live: Boolean(currentSaved),
    soon: Boolean(upcomingSaved) && !currentSaved,
  })

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={buttonLabel}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
        className={`relative inline-flex size-11 md:size-9 items-center justify-center rounded-lg hover:bg-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
          hasSaved ? 'text-brand-soft-fg hover:text-brand-soft-fg' : 'text-fg-muted hover:text-fg'
        }`}
      >
        {hasSaved ? (
          <BookmarkCheck className="size-4" aria-hidden />
        ) : (
          <Bookmark className="size-4" aria-hidden />
        )}
        {hasAlert ? (
          <span
            className="absolute top-1.5 right-1.5 md:top-1 md:right-1 size-2 rounded-full bg-accent ring-2 ring-surface"
            aria-hidden
          />
        ) : null}
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label="My programme"
          className="absolute right-0 top-full mt-2 w-[min(22rem,calc(100vw-2rem))] max-h-[min(28rem,70dvh)] overflow-hidden rounded-2xl border border-line bg-surface shadow-lg z-50 max-md:fixed max-md:left-4 max-md:right-4 max-md:w-auto max-md:top-[calc(4.25rem+env(safe-area-inset-top))]"
        >
          <div className="px-4 py-3 border-b border-line flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-bold text-fg">My programme</p>
              <p className="text-xs text-fg-subtle">
                {hasSaved
                  ? `${savedCount} ${savedCount === 1 ? 'saved item' : 'saved items'}, in time order`
                  : 'Saved items, in time order'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close my programme"
              className="inline-flex size-11 items-center justify-center rounded-lg text-fg-muted hover:bg-subtle"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[min(22rem,55dvh)] p-2">
            {notificationsAvailable ? (
              <div className="px-2 pb-2 mb-2 border-b border-line space-y-2">
                {iPhoneInstallHint ? (
                  <p className="text-xs text-fg-subtle px-1 py-2">
                    On iPhone, add this site to the Home Screen to receive lock-screen alerts.
                  </p>
                ) : null}
                {notificationState === 'granted' ? (
                  <>
                    <p className="text-xs font-medium text-brand-soft-fg px-1 pt-2">
                      System alerts are on for saved sessions.
                    </p>
                    <label className="flex items-start gap-2 px-1 py-1 text-xs text-fg-muted cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-0.5 size-4 shrink-0 rounded accent-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                        checked={conferenceUpdates}
                        onChange={(event) => void setConferenceUpdates(event.target.checked)}
                      />
                      <span>Also receive conference updates</span>
                    </label>
                  </>
                ) : notificationState === 'denied' ? (
                  <p className="text-xs text-fg-subtle px-1 py-2">
                    Notifications are blocked in the browser settings.
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => void enableNotifications()}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-brand-border bg-brand-soft px-3 py-2 text-xs font-semibold text-brand-soft-fg hover:bg-brand-soft/80"
                  >
                    <Bell className="size-3.5" aria-hidden />
                    Enable alerts
                  </button>
                )}
              </div>
            ) : null}
            {!isReady || items.length === 0 ? (
              <p className="text-sm text-fg-muted px-3 py-6 text-center">
                Bookmark a talk or abstract in the programme to add it here.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {items.map((item) => {
                  const live = isHappeningNow(item, now)
                  const soon = !live && isStartingSoon(item, now, leadMinutes)
                  const timeLabel = formatSavedTime(item.startTime, item.endTime)

                  return (
                    <li key={item.id}>
                      <div
                        className={`rounded-xl border px-3 py-2.5 ${
                          live
                            ? 'border-brand bg-brand-soft/80 ring-1 ring-brand/30'
                            : soon
                              ? 'border-accent-border bg-accent-soft/70'
                              : 'border-line bg-subtle/50'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (
                                item.agendaItemId === APPENDIX_AGENDA_ID &&
                                item.abstractId
                              ) {
                                scrollToAppendixAbstract(item.abstractId, { expand: true })
                              } else {
                                focusItem(item.id)
                              }
                              setOpen(false)
                            }}
                            className="flex-1 min-w-0 text-left"
                          >
                            <div className="flex items-center gap-1.5 flex-wrap mb-1">
                              {timeLabel ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-fg-muted">
                                  <Clock className="size-3" aria-hidden />
                                  {timeLabel}
                                </span>
                              ) : item.agendaItemId === APPENDIX_AGENDA_ID ? (
                                <span className="text-[11px] font-semibold text-fg-muted">
                                  Appendix
                                </span>
                              ) : null}
                              {live ? (
                                <span className="text-[10px] font-bold uppercase tracking-wide text-brand-soft-fg">
                                  Live
                                </span>
                              ) : null}
                              {soon ? (
                                <span className="text-[10px] font-bold uppercase tracking-wide text-accent-soft-fg">
                                  Starts soon
                                </span>
                              ) : null}
                            </div>
                            <p className="text-sm font-semibold text-fg leading-snug">{item.title}</p>
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remove ${item.title} from my programme`}
                            className="shrink-0 inline-flex size-11 items-center justify-center rounded-lg text-fg-subtle hover:bg-surface hover:text-fg"
                          >
                            <X className="size-3.5" aria-hidden />
                          </button>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function UpcomingSessionBanner() {
  const { upcomingSaved, upcomingMinutes, focusItem } = useSavedAgenda()
  const [dismissedId, setDismissedId] = useState<string | null>(null)

  const item = upcomingSaved && upcomingSaved.id !== dismissedId ? upcomingSaved : null
  if (!item) return null

  const minutes = Math.max(1, Math.ceil(upcomingMinutes ?? 5))

  return (
    <div
      role="status"
      aria-live="polite"
      className="border-b border-accent-border bg-accent-soft"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-3">
        <p className="flex-1 text-sm text-accent-soft-fg">
          Starts in {minutes} min:{' '}
          <button
            type="button"
            onClick={() => focusItem(item.id)}
            className="font-bold underline-offset-2 hover:underline"
          >
            {item.title}
          </button>
        </p>
        <button
          type="button"
          onClick={() => setDismissedId(item.id)}
          aria-label="Dismiss upcoming session alert"
          className="shrink-0 inline-flex size-11 items-center justify-center rounded-lg text-accent-soft-fg hover:bg-accent/15"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  )
}

function formatSavedTime(startTime?: string | null, endTime?: string | null): string {
  const date = formatConferenceDateShort(startTime)
  const start = formatConferenceTime(startTime)
  const end = formatConferenceTime(endTime)
  const range = start && end ? `${start} – ${end}` : start
  if (date && range) return `${date} · ${range}`
  return date || range
}

function programmeButtonLabel({
  savedCount,
  isReady,
  live,
  soon,
}: {
  savedCount: number
  isReady: boolean
  live: boolean
  soon: boolean
}): string {
  if (!isReady || savedCount === 0) return 'My programme'

  const count = savedCount === 1 ? '1 saved item' : `${savedCount} saved items`
  if (live) return `My programme, ${count}, a saved session is live`
  if (soon) return `My programme, ${count}, a saved session is starting soon`
  return `My programme, ${count}`
}
