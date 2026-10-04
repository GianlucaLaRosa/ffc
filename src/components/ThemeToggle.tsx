'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <button
      type="button"
      suppressHydrationWarning
      disabled={!mounted}
      onClick={() => {
        if (!mounted) return
        setTheme(isDark ? 'light' : 'dark')
      }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`inline-flex size-9 items-center justify-center rounded-lg text-fg-muted hover:bg-subtle hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${className}`}
    >
      {mounted ? (
        isDark ? (
          <Sun className="size-4" aria-hidden />
        ) : (
          <Moon className="size-4" aria-hidden />
        )
      ) : (
        <span className="size-4" aria-hidden />
      )}
    </button>
  )
}
