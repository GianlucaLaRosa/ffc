'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { RichText } from './RichText'
import { ThemeToggle } from './ThemeToggle'
import { SavedAgendaMenu } from './SavedAgendaMenu'
import { InstallPwaButton } from './InstallPwaButton'
import { Calendar, MapPin, BookOpen, Home } from 'lucide-react'
import { mediaUrl } from '@/utilities/conferenceUi'
import { ArchiveNav } from '@/components/ArchiveNav'
import type { ArchivedEditionLink } from '@/utilities/getConferenceEdition'

const navLinkClassName =
  'px-3.5 py-2 rounded-lg text-sm font-semibold text-fg-muted hover:text-brand-soft-fg hover:bg-brand-soft/70 transition-colors flex items-center gap-2'
const mobileNavLinkClassName =
  'flex items-center gap-3 px-4 py-3 min-h-11 rounded-lg text-sm font-semibold text-fg hover:bg-brand-soft hover:text-brand-soft-fg'

function CurrentEditionLink({ variant }: { variant: 'desktop' | 'mobile' }) {
  return (
    <Link href="/" className={variant === 'mobile' ? mobileNavLinkClassName : navLinkClassName}>
      <Home className="w-4 h-4 text-brand" aria-hidden />
      <span>Current edition</span>
    </Link>
  )
}

export interface HeaderProps {
  editionName: any
  editionYear?: number | null
  logo?: any
  archivedEditions?: ArchivedEditionLink[]
  isArchived?: boolean
  brand?: 'edition' | 'archive'
  showSectionNav?: boolean
  showSavedAgenda?: boolean
}

export function Header({
  editionName,
  editionYear,
  logo,
  archivedEditions = [],
  isArchived = false,
  brand = 'edition',
  showSectionNav = true,
  showSavedAgenda = true,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const logoSrc = mediaUrl(logo) || '/logo.png'

  const navLinks = [
    { label: 'Programme', hash: 'programme', icon: Calendar },
    { label: 'Venue', hash: 'venue', icon: MapPin },
    { label: 'Appendix', hash: 'appendix', icon: BookOpen },
  ]

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    const target = document.getElementById(hash)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-line/80 shadow-xs transition-all pt-[env(safe-area-inset-top)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 h-16 sm:h-20">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <Link
              href="/"
              aria-label="Current edition"
              onClick={(e) => {
                if (!isArchived) {
                  e.preventDefault()
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
                setMobileMenuOpen(false)
              }}
              className="shrink-0 rounded-lg p-1 outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoSrc}
                alt=""
                className="h-9 sm:h-11 w-auto object-contain rounded"
              />
            </Link>
            <button
              type="button"
              onClick={scrollToTop}
              className="leading-tight min-w-0 rounded-lg p-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              {brand === 'archive' ? (
                <>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-brand-soft-fg hidden sm:block">
                    FFC Scientific Conference
                  </span>
                  <span className="block text-sm sm:text-base font-extrabold text-fg">Archive</span>
                </>
              ) : (
                <>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-brand-soft-fg hidden sm:block">
                    {isArchived ? 'Archived edition' : 'Scientific Event'} {editionYear || ''}
                  </span>
                  <span className="block text-sm sm:text-base font-extrabold text-fg line-clamp-1">
                    <RichText content={editionName} disableContainer className="rich-text-inline" />
                  </span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-0.5 sm:gap-2 shrink-0">
            <nav className="hidden md:flex items-center gap-1 sm:gap-2" aria-label="Main Navigation">
              {showSectionNav
                ? navLinks.map((link) => {
                    const Icon = link.icon
                    return (
                      <a
                        key={link.hash}
                        href={`#${link.hash}`}
                        onClick={(e) => handleScroll(e, link.hash)}
                        className={navLinkClassName}
                      >
                        <Icon className="w-4 h-4 text-brand" />
                        <span>{link.label}</span>
                      </a>
                    )
                  })
                : null}
              {brand === 'archive' ? <CurrentEditionLink variant="desktop" /> : null}
              <ArchiveNav editions={archivedEditions} variant="desktop" />
            </nav>
            {showSavedAgenda ? <SavedAgendaMenu /> : null}
            <div className="hidden md:block">
              <InstallPwaButton />
            </div>
            <ThemeToggle className="hidden md:inline-flex ml-1" />
            <div className="flex md:hidden items-center">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
                className="inline-flex size-11 items-center justify-center rounded-lg text-fg-muted hover:bg-subtle focus:outline-none focus:ring-2 focus:ring-brand"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 border-b border-line bg-surface px-4 pt-3 pb-5 shadow-lg backdrop-blur-md animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-2">
            {showSectionNav
              ? navLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <a
                      key={link.hash}
                      href={`#${link.hash}`}
                      onClick={(e) => handleScroll(e, link.hash)}
                      className={mobileNavLinkClassName}
                    >
                      <Icon className="w-4 h-4 text-brand" />
                      <span>{link.label}</span>
                    </a>
                  )
                })
              : null}
            {brand === 'archive' ? <CurrentEditionLink variant="mobile" /> : null}
            <ArchiveNav
              editions={archivedEditions}
              variant="mobile"
              onNavigate={() => setMobileMenuOpen(false)}
            />
            <ThemeToggle variant="row" />
            <InstallPwaButton variant="row" />
          </div>
        </div>
      )}
    </header>
  )
}
