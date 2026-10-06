'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/utilities/ui'

export function CopyOverlayLink({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false)
  const resetTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (resetTimer.current != null) window.clearTimeout(resetTimer.current)
    }
  }, [])

  const label = copied ? 'Copied' : 'Copy link'

  return (
    <button
      type="button"
      className={cn(
        'inline-flex h-11 sm:h-9 items-center gap-1.5 px-3 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand shrink-0',
        className,
      )}
      aria-label={label}
      title={label}
      onClick={async (event) => {
        event.stopPropagation()
        try {
          await navigator.clipboard.writeText(window.location.href)
          setCopied(true)
          if (resetTimer.current != null) window.clearTimeout(resetTimer.current)
          resetTimer.current = window.setTimeout(() => setCopied(false), 2000)
        } catch {
          setCopied(false)
        }
      }}
    >
      {copied ? (
        <Check className="size-4 shrink-0" aria-hidden />
      ) : (
        <Copy className="size-4 shrink-0" aria-hidden />
      )}
      <span aria-live="polite">{label}</span>
    </button>
  )
}
