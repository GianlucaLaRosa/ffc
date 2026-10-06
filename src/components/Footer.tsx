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
    <span className="inline-flex items-center justify-end gap-1.5 font-medium text-fg-muted hover:text-brand-soft-fg transition-colors">
      {icon?.name && <SessionIcon name={icon} className="w-3.5 h-3.5 shrink-0" />}
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
  const credits = (footer?.credits ?? []).filter(
    (row) => row.role?.trim() && row.name?.trim(),
  )
  const hasOrgLinks = Boolean(footer?.structure?.label || footer?.delegation?.label)
  const hasMeta = hasOrgLinks || credits.length > 0

  return (
    <footer className="border-t border-line bg-surface text-xs text-fg-subtle">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {hasMeta && (
          <div className="py-8 sm:py-10 border-b border-line grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-10 items-start">
            {credits.length > 0 ? (
              <ul className="flex flex-col gap-2.5 text-fg-muted max-w-3xl">
                {credits.map((credit) => (
                  <li key={credit.id ?? `${credit.role}-${credit.name}`} className="leading-relaxed">
                    <span className="font-semibold text-fg">{credit.role}</span>
                    <span className="text-fg-subtle"> · {credit.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="hidden md:block" aria-hidden />
            )}

            {hasOrgLinks && (
              <div className="flex flex-col gap-3 items-end text-right md:col-start-2">
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
          </div>
        )}

        <div className="py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-soft text-brand-soft-fg border border-brand-border/60 font-medium text-center">
            <ShieldCheck className="w-4 h-4 text-brand shrink-0" />
            <span>
              Privacy-First · Technical cookies only{editionYear ? ` · ${editionYear}` : ''}
            </span>
          </div>

          <nav
            className="flex flex-wrap items-center justify-center gap-5 sm:gap-6"
            aria-label="Legal"
          >
            <Link
              href="/cookie-policy"
              prefetch={false}
              className="font-medium text-fg-muted hover:text-brand-soft-fg transition-colors"
            >
              {footer?.cookiePolicy?.title?.trim() || 'Cookie Policy'}
            </Link>
            <Link
              href="/privacy"
              prefetch={false}
              className="font-medium text-fg-muted hover:text-brand-soft-fg transition-colors"
            >
              {footer?.privacyPolicy?.title?.trim() || 'Privacy Policy'}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
