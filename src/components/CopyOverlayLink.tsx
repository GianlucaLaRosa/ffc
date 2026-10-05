'use client'

import React, { useState } from 'react'
import { Check, Link2 } from 'lucide-react'

export function CopyOverlayLink({
  className,
  iconClassName = 'w-5 h-5',
}: {
  className: string
  iconClassName?: string
}) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      type="button"
      className={className}
      aria-label={copied ? 'Link copied' : 'Copy link'}
      onClick={async (event) => {
        event.stopPropagation()
        try {
          await navigator.clipboard.writeText(window.location.href)
          setCopied(true)
          window.setTimeout(() => setCopied(false), 2000)
        } catch {
          setCopied(false)
        }
      }}
    >
      {copied ? <Check className={iconClassName} /> : <Link2 className={iconClassName} />}
    </button>
  )
}
