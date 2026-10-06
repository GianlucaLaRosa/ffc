'use client'

import Link from 'next/link'
import React, { useEffect, useId, useState } from 'react'
import { acceptCookieConsent, hasCookieConsent } from '@/utilities/cookieConsent'

export function CookieConsentBanner() {
  const titleId = useId()
  const [visible, setVisible] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!hasCookieConsent()) setVisible(true)
  }, [])

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      className="fixed inset-x-0 bottom-0 z-[55] border-t border-line bg-surface/95 backdrop-blur-md shadow-up pb-[env(safe-area-inset-bottom)]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 space-y-2">
            <p id={titleId} className="text-sm font-semibold text-fg">
              Cookies and local storage
            </p>
            <p className="text-sm leading-relaxed text-fg-muted">
              This site uses only strictly necessary technical storage: session preferences (such
              as your saved programme and theme), short-lived session data, and an optional
              service worker for installable alerts. We do not use profiling, analytics, or
              advertising cookies.{' '}
              <Link
                href="/cookie-policy"
                prefetch={false}
                className="font-medium text-brand-soft-fg underline-offset-2 hover:underline"
              >
                Cookie Policy
              </Link>
            </p>
            <label className="flex items-start gap-2.5 text-sm text-fg-muted cursor-pointer">
              <input
                type="checkbox"
                checked={checked}
                onChange={(event) => setChecked(event.target.checked)}
                className="mt-0.5 size-4 shrink-0 rounded border-line text-brand focus:ring-brand"
              />
              <span>
                I have read the Cookie Policy and accept the use of strictly necessary technical
                cookies and local storage on this device.
              </span>
            </label>
          </div>

          <button
            type="button"
            disabled={!checked}
            onClick={() => {
              acceptCookieConsent()
              setVisible(false)
            }}
            className="shrink-0 inline-flex items-center justify-center rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-brand-fg transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-45"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
