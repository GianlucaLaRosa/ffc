'use client'

import React, { useEffect } from 'react'
import { RichText } from './RichText'
import { X, Building2, User, Sparkles } from './IconRenderer'
import { CopyOverlayLink } from './CopyOverlayLink'
import { PhotoCarouselOverlay } from './PhotoCarouselOverlay'
import type { Abstract } from '@/payload-types'
import {
  AUTHOR_ROLE_LABEL,
  abstractAuthors,
  abstractGallerySlides,
  abstractStatusLabel,
  mediaUrl,
  personInstitution,
  personName,
} from '@/utilities/conferenceUi'

export interface AbstractModalProps {
  abstract: Abstract | null
  photoIndex: number | null
  isOpen: boolean
  onClose: () => void
  onOpenPhoto: (index0: number) => void
  onPhotoIndexChange: (index0: number) => void
}

export function AbstractModal({
  abstract,
  photoIndex,
  isOpen,
  onClose,
  onOpenPhoto,
  onPhotoIndexChange,
}: AbstractModalProps) {
  const carouselOpen = photoIndex != null

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || !isOpen || carouselOpen) return
      onClose()
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [carouselOpen, isOpen, onClose])

  if (!isOpen || !abstract) return null

  const authors = abstractAuthors(abstract)
  const speakers = authors.filter((row) => row.isSpeaker)
  const contentSections = Array.isArray(abstract.content) ? abstract.content : []
  const gallerySlides = abstractGallerySlides(abstract)
  const previewSlide = gallerySlides[0]
  const relatedCodes = Array.isArray(abstract.relatedCodes) ? abstract.relatedCodes : []
  const appendices = Array.isArray(abstract.appendices) ? abstract.appendices : []

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-fg/80 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="abstract-modal-title"
      onClick={() => {
        if (carouselOpen) return
        onClose()
      }}
    >
      <div
        className="relative w-full max-w-4xl h-[100dvh] sm:h-[88vh] max-h-[100dvh] bg-surface rounded-none sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 pt-[env(safe-area-inset-top)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2 px-4 sm:px-6 py-3 sm:py-4 border-b border-line bg-subtle/90 backdrop-blur shrink-0">
          <div className="flex items-center gap-2.5 flex-wrap min-w-0">
            {abstract.code && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-soft text-brand-soft-fg border border-brand-border">
                {abstract.code}
              </span>
            )}
            {abstractStatusLabel(abstract.status) && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-fg bg-brand">
                {abstractStatusLabel(abstract.status)}
              </span>
            )}
            {relatedCodes.map((row) => (
              <span
                key={row.id || row.code}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-subtle text-fg-muted border border-line"
              >
                {row.code}
                {abstractStatusLabel(row.status) ? ` · ${abstractStatusLabel(row.status)}` : ''}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1 -mr-1 shrink-0">
            <CopyOverlayLink className="inline-flex size-11 sm:size-9 items-center justify-center text-fg-subtle hover:text-fg-muted hover:bg-line/60 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand" />
            <button
              type="button"
              onClick={onClose}
              className="inline-flex size-11 sm:size-9 items-center justify-center text-fg-subtle hover:text-fg-muted hover:bg-line/60 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
              aria-label="Close abstract details modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-8 sm:py-6 space-y-8">
          <div>
            <h1
              id="abstract-modal-title"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-fg leading-snug"
            >
              <RichText content={abstract.title} disableContainer className="rich-text-inline" />
            </h1>
          </div>

          {speakers.length > 0 && (
            <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-brand-soft to-accent-soft/40 border border-brand-border/80">
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-soft-fg mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand" />
                Featured Presenters & Speakers
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {speakers.map((row) => {
                  const instName = personInstitution(row.person) || 'Independent Researcher'
                  const photo = mediaUrl(row.person.photo)
                  return (
                    <div
                      key={row.person.id}
                      className="p-3.5 rounded-lg border bg-surface flex items-start gap-3 shadow-xs border-brand-border ring-2 ring-brand/20"
                    >
                      <div className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-brand-soft-fg shrink-0 overflow-hidden font-bold text-sm">
                        {photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={photo}
                            alt={personName(row.person)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-brand" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-fg text-sm">
                            {personName(row.person)}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand text-brand-fg uppercase tracking-wider">
                            Speaker
                          </span>
                        </div>
                        <p className="text-xs text-fg-subtle truncate mt-0.5">{instName}</p>
                        {row.person.bio && (
                          <div className="text-xs text-fg-muted mt-2 line-clamp-3">
                            <RichText content={row.person.bio} />
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {authors.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-fg-subtle mb-2">
                Authors & Affiliations
              </h2>
              <ul className="flex flex-wrap gap-2 text-sm text-fg-muted">
                {authors.map((row) => {
                  const instName = personInstitution(row.person)
                  return (
                    <li
                      key={row.person.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-subtle border border-line/80 text-xs font-medium text-fg max-w-full"
                    >
                      <span className="min-w-0">{personName(row.person)}</span>
                      <span className="text-fg-subtle shrink-0">
                        {AUTHOR_ROLE_LABEL[row.role] || row.role}
                      </span>
                      {instName && (
                        <span className="text-fg-subtle flex items-center gap-0.5 min-w-0">
                          • <Building2 className="w-3 h-3 inline shrink-0" />{' '}
                          <span className="truncate">{instName}</span>
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {contentSections.length > 0 && (
            <div className="space-y-6 pt-2">
              {contentSections.map((sec, i) => (
                <section
                  key={sec.id || i}
                  className="p-4 sm:p-5 rounded-xl bg-subtle/70 border border-line/80"
                >
                  {sec.title && (
                    <h3 className="text-sm font-bold uppercase tracking-wider text-fg mb-2.5 pb-2 border-b border-line">
                      {sec.title}
                    </h3>
                  )}
                  <div className="text-sm text-fg-muted leading-relaxed">
                    <RichText content={sec.description} />
                  </div>
                </section>
              ))}
            </div>
          )}

          {appendices.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-fg-subtle">
                Abstract appendix
              </h2>
              {appendices.map((row, i) => (
                <section
                  key={row.id || i}
                  className="p-4 sm:p-5 rounded-xl border border-line bg-surface"
                >
                  {row.title && (
                    <h3 className="text-sm font-bold text-fg mb-2">{row.title}</h3>
                  )}
                  {row.body && (
                    <div className="text-sm text-fg-muted leading-relaxed">
                      <RichText content={row.body} />
                    </div>
                  )}
                </section>
              ))}
            </div>
          )}

          {previewSlide ? (
            <div className="pt-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-fg-subtle mb-3">
                Photos
              </h2>
              <button
                type="button"
                onClick={() => onOpenPhoto(0)}
                className="group w-full overflow-hidden rounded-xl border border-line bg-subtle text-left focus:outline-none focus:ring-2 focus:ring-brand"
                aria-label={
                  gallerySlides.length > 1
                    ? `Open photo gallery, ${gallerySlides.length} photos`
                    : 'Open photo'
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewSlide.url}
                  alt={previewSlide.alt}
                  className="w-full h-40 sm:h-52 object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                />
                {previewSlide.caption ? (
                  <span className="block p-3 text-xs text-fg-muted bg-surface border-t border-line italic">
                    {previewSlide.caption}
                  </span>
                ) : null}
              </button>
            </div>
          ) : null}
        </div>

        <div className="px-4 sm:px-6 py-3.5 border-t border-line bg-subtle flex justify-stretch sm:justify-end shrink-0 pb-[max(0.875rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto min-h-11 px-5 py-2 rounded-lg bg-fg text-page text-sm font-medium hover:opacity-90 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-brand"
          >
            Close
          </button>
        </div>
      </div>
      {carouselOpen ? (
        <PhotoCarouselOverlay
          slides={gallerySlides}
          index={photoIndex ?? 0}
          onIndexChange={onPhotoIndexChange}
          onClose={onClose}
        />
      ) : null}
    </div>
  )
}
