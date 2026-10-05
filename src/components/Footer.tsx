import React from 'react'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { SessionIcon } from './IconRenderer'
import type { Footer as FooterGlobal } from '@/payload-types'

export interface FooterProps {
  editionYear?: number | null
  footer?: FooterGlobal | null
}

function OrgLink({
  label,
  url,
  icon,
}: {
  label?: string | null
  url?: string | null
  icon?: FooterGlobal['structure']['icon']
}) {
  if (!label && !url) return null
  const content = (
    <span className="inline-flex items-center gap-1.5 font-medium text-fg-muted hover:text-brand-soft-fg transition-colors">
      {icon?.name && <SessionIcon name={icon} className="w-3.5 h-3.5" />}
      <span>{label || url}</span>
    </span>
  )
  if (!url) return content
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  )
}

export function Footer({ editionYear = 2026, footer }: FooterProps) {
  return (
    <footer className="border-t border-line bg-surface py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] text-xs text-fg-subtle">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {(footer?.structure?.label || footer?.delegation?.label) && (
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <OrgLink
              icon={footer?.structure?.icon}
              label={footer?.structure?.label}
              url={footer?.structure?.url}
            />
            <OrgLink
              icon={footer?.delegation?.icon}
              label={footer?.delegation?.label}
              url={footer?.delegation?.url}
            />
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-soft text-brand-soft-fg border border-brand-border/60 font-medium">
            <ShieldCheck className="w-4 h-4 text-brand shrink-0" />
            <span>Cookie-Free &amp; Privacy-First Platform {editionYear ? `· ${editionYear}` : ''}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6">
            <Link
              href="/cookie-policy"
              prefetch={false}
              className="font-medium text-fg-muted hover:text-brand-soft-fg transition-colors"
            >
              Cookie Policy
            </Link>
            <Link
              href="/privacy"
              prefetch={false}
              className="font-medium text-fg-muted hover:text-brand-soft-fg transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
