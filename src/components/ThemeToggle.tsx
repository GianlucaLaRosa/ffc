'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'

export function ThemeToggle({
  className = '',
  variant = 'icon',
}: {
  className?: string
  variant?: 'icon' | 'row'
}) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <button
      type="button"
      suppressHydrationWarning
      disabled={!mounted}
      onClick={() => {
        if (!mounted) return
        setTheme(isDark ? 'light' : 'dark')
      }}
      aria-label={label}
      className={
        variant === 'row'
          ? `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-fg hover:bg-brand-soft hover:text-brand-soft-fg w-full text-left min-h-11 ${className}`
          : `inline-flex size-11 md:size-9 items-center justify-center rounded-lg text-fg-muted hover:bg-subtle hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${className}`
      }
    >
      {mounted ? (
        isDark ? (
          <Sun className="size-4 shrink-0" aria-hidden />
        ) : (
          <Moon className="size-4 shrink-0" aria-hidden />
        )
      ) : (
        <span className="size-4 shrink-0" aria-hidden />
      )}
      {variant === 'row' ? <span>{isDark ? 'Light mode' : 'Dark mode'}</span> : null}
    </button>
  )
}
