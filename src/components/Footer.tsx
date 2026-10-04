import React from 'react'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { SessionIcon } from './IconRenderer'
import type { Conference, Footer as FooterGlobal } from '@/payload-types'
import { conferencePublicPath, relationSlug } from '@/utilities/conferenceRoutes'

export interface FooterProps {
  editionYear?: number | null
  footer?: FooterGlobal | null
  activeSlug?: string | null
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
    <span className="inline-flex items-center gap-1.5 font-medium text-slate-600 hover:text-emerald-800 transition-colors">
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

function footerNavHref(
  link: NonNullable<FooterGlobal['navItems']>[number]['link'],
  activeSlug?: string | null,
): string | null {
  if (link.type === 'custom') return link.url || null
  const referenced = link.reference?.value
  const slug = relationSlug(typeof referenced === 'object' ? (referenced as Conference) : null)
  const publicArchive =
    typeof referenced === 'object' && referenced !== null
      ? Boolean((referenced as Conference).publicArchive)
      : false
  return conferencePublicPath({ slug, publicArchive, activeSlug })
}

export function Footer({ editionYear = 2026, footer, activeSlug }: FooterProps) {
  const navItems = footer?.navItems ?? []

  return (
    <footer className="border-t border-slate-200 bg-white py-10 text-xs text-slate-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {(footer?.structure?.label || footer?.delegation?.label || navItems.length > 0) && (
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
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
            <div className="flex flex-wrap items-center justify-center gap-4">
              {navItems.map((item) => {
                const link = item.link
                if (!link?.label) return null
                const href = footerNavHref(link, activeSlug)
                if (!href) return null
                return (
                  <Link
                    key={item.id || link.label}
                    href={href}
                    prefetch={false}
                    target={link.newTab ? '_blank' : undefined}
                    rel={link.newTab ? 'noopener noreferrer' : undefined}
                    className="font-medium text-slate-600 hover:text-emerald-800 transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Cookie-Free &amp; Privacy-First Platform {editionYear ? `· ${editionYear}` : ''}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6">
            <Link
              href="/cookie-policy"
              prefetch={false}
              className="font-medium text-slate-600 hover:text-emerald-800 transition-colors"
            >
              Cookie Policy
            </Link>
            <Link
              href="/privacy"
              prefetch={false}
              className="font-medium text-slate-600 hover:text-emerald-800 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
