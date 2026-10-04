'use client'

import React, { useEffect, useId, useRef, useState } from 'react'
import { Download, Share } from 'lucide-react'
import { usePwaInstall } from '@/components/PwaProvider'

export function InstallPwaButton({
  variant = 'icon',
}: {
  variant?: 'icon' | 'row'
}) {
  const { canPrompt, isIos, promptInstall } = usePwaInstall()
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

  if (!canPrompt && !isIos) return null

  const onClick = async () => {
    if (isIos) {
      setOpen((prev) => !prev)
      return
    }
    await promptInstall()
  }

  const buttonClass =
    variant === 'row'
      ? 'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-fg hover:bg-brand-soft hover:text-brand-soft-fg w-full text-left'
      : 'inline-flex size-9 items-center justify-center rounded-lg text-fg-muted hover:bg-subtle hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand'

  return (
    <div ref={rootRef} className={variant === 'row' ? 'w-full' : 'relative'}>
      <button
        type="button"
        onClick={() => void onClick()}
        aria-label="Install app"
        aria-expanded={isIos ? open : undefined}
        aria-controls={isIos ? panelId : undefined}
        className={buttonClass}
      >
        <Download className="size-4 text-brand" aria-hidden />
        {variant === 'row' ? <span>Install app</span> : null}
      </button>

      {isIos && open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label="Install on iPhone"
          className="absolute right-0 top-full mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-line bg-surface shadow-lg z-50 p-4 text-left max-md:fixed max-md:left-4 max-md:right-4 max-md:w-auto max-md:top-[4.25rem]"
        >
          <p className="text-sm font-semibold text-fg">Install this app</p>
          <p className="mt-2 text-sm text-fg-muted leading-relaxed">
            Tap the Share icon
            <Share className="inline size-3.5 mx-1 align-text-bottom" aria-hidden />
            then choose <span className="font-semibold text-fg">Add to Home Screen</span>.
          </p>
        </div>
      ) : null}
    </div>
  )
}
