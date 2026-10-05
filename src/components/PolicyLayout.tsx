import React from 'react'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { Footer } from '@/components/Footer'
import { PolicyChrome } from '@/components/PolicyChrome'
import { ThemeToggle } from '@/components/ThemeToggle'
import { InstallPwaButton } from '@/components/InstallPwaButton'
import type { Footer as FooterGlobal } from '@/payload-types'

export function PolicyLayout({
  headerBadge,
  title,
  kicker,
  intro,
  lastUpdated,
  footer,
  children,
}: {
  headerBadge?: string | null
  title: string
  kicker?: string | null
  intro?: React.ReactNode
  lastUpdated?: string | null
  footer?: FooterGlobal | null
  children: React.ReactNode
}) {
  return (
    <PolicyChrome>
      <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur-md border-b border-line/80 pt-[env(safe-area-inset-top)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          <Link
            href="/"
            prefetch={false}
            className="inline-flex items-center gap-2 min-h-11 text-sm font-medium text-fg-muted hover:text-brand-soft-fg transition-colors min-w-0"
          >
            <ArrowLeft className="w-4 h-4 text-brand shrink-0" />
            <span className="sm:hidden">Back</span>
            <span className="hidden sm:inline">Back to Conference Home</span>
          </Link>
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {headerBadge ? (
              <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-brand-soft-fg bg-brand-soft border border-brand-border/80 px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-brand" />
                <span>{headerBadge}</span>
              </div>
            ) : null}
            <InstallPwaButton />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-surface rounded-2xl border border-line shadow-xs p-6 sm:p-10 mb-8">
          {kicker ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-subtle text-fg-muted text-xs font-semibold mb-4">
              <span>{kicker}</span>
            </div>
          ) : null}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-fg tracking-tight mb-3">{title}</h1>
          {intro ? (
            <div className="text-fg-muted text-base sm:text-lg leading-relaxed mb-4 policy-intro">
              {intro}
            </div>
          ) : null}
          {lastUpdated ? (
            <p className="text-xs text-fg-subtle font-mono">Last updated: {lastUpdated}</p>
          ) : null}
        </div>
        {children}
      </main>

      <Footer footer={footer} />
    </PolicyChrome>
  )
}
