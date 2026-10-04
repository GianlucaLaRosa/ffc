'use client'

import React, { useState } from 'react'
import { RichText } from './RichText'
import { ThemeToggle } from './ThemeToggle'
import { SavedAgendaMenu } from './SavedAgendaMenu'
import { InstallPwaButton } from './InstallPwaButton'
import { Calendar, MapPin, BookOpen } from 'lucide-react'
import { mediaUrl } from '@/utilities/conferenceUi'

export interface HeaderProps {
  editionName: any
  editionYear?: number | null
  logo?: any
}

export function Header({ editionName, editionYear, logo }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Programme', href: '#programme', icon: Calendar },
    { label: 'Venue', href: '#venue', icon: MapPin },
    { label: 'Appendix', href: '#appendix', icon: BookOpen },
  ]

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-line/80 shadow-xs transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-brand rounded-lg p-1"
          >
            {mediaUrl(logo) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mediaUrl(logo) || ''}
                alt="FFC Ricerca Logo"
                className="h-10 sm:h-11 w-auto object-contain rounded"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/logo.png"
                alt="FFC Ricerca Logo"
                className="h-10 sm:h-11 w-auto object-contain rounded"
              />
            )}
            <div className="leading-tight">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-soft-fg block">
                Scientific Event {editionYear || ''}
              </span>
              <div className="text-sm sm:text-base font-extrabold text-fg line-clamp-1">
                <RichText content={editionName} disableContainer className="rich-text-inline" />
              </div>
            </div>
          </a>

          <div className="flex items-center gap-1 sm:gap-2">
            <nav className="hidden md:flex items-center gap-1 sm:gap-2" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleScroll(e, link.href)}
                    className="px-3.5 py-2 rounded-lg text-sm font-semibold text-fg-muted hover:text-brand-soft-fg hover:bg-brand-soft/70 transition-colors flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4 text-brand" />
                    <span>{link.label}</span>
                  </a>
                )
              })}
            </nav>
            <SavedAgendaMenu />
            <InstallPwaButton />
            <ThemeToggle className="hidden md:inline-flex ml-1" />
            <div className="flex md:hidden items-center gap-1">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
                className="p-2 rounded-lg text-fg-muted hover:bg-subtle focus:outline-none focus:ring-2 focus:ring-brand"
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
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleScroll(e, link.href)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-fg hover:bg-brand-soft hover:text-brand-soft-fg"
                >
                  <Icon className="w-4 h-4 text-brand" />
                  <span>{link.label}</span>
                </a>
              )
            })}
            <InstallPwaButton variant="row" />
          </div>
        </div>
      )}
    </header>
  )
}
