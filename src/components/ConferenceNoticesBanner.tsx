'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Info, Megaphone, X } from 'lucide-react'
import {
  isConferenceNoticeVisible,
  noticeHref,
  type PublicConferenceNotice,
} from '@/utilities/conferenceNotices'
import { useSavedAgenda } from '@/context/SavedAgendaContext'

const DISMISS_KEY = 'ffc-dismissed-notices'

function readDismissed(): Set<string> {
  try {
    const raw = window.sessionStorage.getItem(DISMISS_KEY)
    const parsed = raw ? (JSON.parse(raw) as unknown) : []
    return new Set(Array.isArray(parsed) ? parsed.map(String) : [])
  } catch {
    return new Set()
  }
}

function writeDismissed(ids: Set<string>): void {
  window.sessionStorage.setItem(DISMISS_KEY, JSON.stringify([...ids]))
}

function severityIcon(severity: PublicConferenceNotice['severity']) {
  if (severity === 'urgent') return AlertTriangle
  if (severity === 'info') return Info
  return Megaphone
}

function severityClass(severity: PublicConferenceNotice['severity']): string {
  if (severity === 'urgent') {
    return 'border-b border-red-300/80 bg-red-50 text-red-950 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-50'
  }
  if (severity === 'info') {
    return 'border-b border-line bg-subtle text-fg'
  }
  return 'border-b border-accent-border bg-accent-soft text-accent-soft-fg'
}

export function ConferenceNoticesBanner({
  notices,
  canonicalPath,
}: {
  notices: PublicConferenceNotice[]
  canonicalPath: string
}) {
  const { focusItem } = useSavedAgenda()
  const [dismissed, setDismissed] = useState<Set<string>>(() => new Set())
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    setDismissed(readDismissed())
    const id = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  const visible = useMemo(
    () =>
      notices.filter(
        (notice) =>
          !dismissed.has(String(notice.id)) && isConferenceNoticeVisible(notice, now),
      ),
    [dismissed, notices, now],
  )

  if (visible.length === 0) return null

  return (
    <div className="flex flex-col">
      {visible.map((notice) => {
        const Icon = severityIcon(notice.severity)
        const href = noticeHref({
          canonicalPath,
          linkPath: notice.linkPath,
          relatedAgendaItemId: notice.relatedAgendaItemId,
        })

        return (
          <div
            key={String(notice.id)}
            role="status"
            aria-live="polite"
            className={severityClass(notice.severity)}
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-start gap-3">
              <Icon className="size-4 mt-0.5 shrink-0 opacity-80" aria-hidden />
              <div className="flex-1 min-w-0 text-sm">
                <p className="font-bold leading-snug">{notice.title}</p>
                <p className="leading-snug opacity-90">{notice.body}</p>
                {href ? (
                  <button
                    type="button"
                    className="mt-1 text-xs font-semibold underline-offset-2 hover:underline"
                    onClick={() => {
                      if (notice.relatedAgendaItemId) {
                        focusItem(notice.relatedAgendaItemId)
                      }
                      if (href.includes('#')) {
                        const hash = href.slice(href.indexOf('#'))
                        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
                        return
                      }
                      if (href.startsWith('?') || href.includes('?agenda=')) {
                        return
                      }
                      window.location.assign(href)
                    }}
                  >
                    Open details
                  </button>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => {
                  setDismissed((prev) => {
                    const next = new Set(prev)
                    next.add(String(notice.id))
                    writeDismissed(next)
                    return next
                  })
                }}
                aria-label={`Dismiss notice ${notice.title}`}
                className="shrink-0 inline-flex size-8 items-center justify-center rounded-lg opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
