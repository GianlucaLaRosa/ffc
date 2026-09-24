'use client'

import React, { useState } from 'react'
import { RichText } from './RichText'
import { Calendar, MapPin, BookOpen, ExternalLink } from 'lucide-react'

export interface HeaderProps {
  editionName: any
  editionYear?: number | null
  logo?: any
  primaryColor?: string | null
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo / Brand */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg p-1"
          >
            {logo?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo.url}
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
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 block">
                Scientific Event {editionYear || ''}
              </span>
              <div className="text-sm sm:text-base font-extrabold text-slate-900 line-clamp-1">
                <RichText content={editionName} />
              </div>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleScroll(e, link.href)}
                  className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/70 transition-colors flex items-center gap-2"
                >
                  <Icon className="w-4 h-4 text-emerald-700" />
                  <span>{link.label}</span>
                </a>
              )
            })}

            <div className="h-5 w-px bg-slate-200 mx-2" />

            <a
              href="/admin"
              className="px-3.5 py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors inline-flex items-center gap-1.5"
            >
              <span>Backoffice</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </nav>

          {/* Mobile menu hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/98 px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const Icon = link.icon
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleScroll(e, link.href)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-800"
              >
                <Icon className="w-4 h-4 text-emerald-700" />
                <span>{link.label}</span>
              </a>
            )
          })}
          <div className="pt-2 border-t border-slate-100">
            <a
              href="/admin"
              className="flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100"
            >
              <span>Backoffice Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
