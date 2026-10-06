'use client'

import React, { useEffect, useState } from 'react'
import { RichText } from './RichText'
import { X, Building2, User, Sparkles, Images, ChevronDown } from './IconRenderer'
import { List } from 'lucide-react'
import { scrollToAppendixAbstract } from '@/utilities/appendixNavigation'
import { CopyOverlayLink } from './CopyOverlayLink'
import { PhotoCarouselOverlay } from './PhotoCarouselOverlay'
import type { Abstract } from '@/payload-types'
import {
  AUTHOR_ROLE_LABEL,
  abstractAuthorSlideIndex,
  abstractAuthors,
  abstractCoverSlide,
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
  const [expandedAuthorId, setExpandedAuthorId] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) setExpandedAuthorId(null)
  }, [isOpen, abstract?.id])

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
  const cover = abstractCoverSlide(abstract)
  const relatedCodes = Array.isArray(abstract.relatedCodes) ? abstract.relatedCodes : []

  const openAuthorPhoto = (personId: number | string) => {
    const index = abstractAuthorSlideIndex(gallerySlides, personId)
    if (index == null) return
    onOpenPhoto(index)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-overlay/75 dark:bg-overlay/85 backdrop-blur-sm transition-opacity"
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
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-soft-fg bg-brand-soft border border-brand-border">
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
            <button
              type="button"
              onClick={() => {
                onClose()
                scrollToAppendixAbstract(abstract.id)
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-fg-muted hover:text-fg hover:bg-line/60 transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <List className="w-3.5 h-3.5" aria-hidden />
              View in appendix
            </button>
            <CopyOverlayLink className="text-fg-subtle hover:text-fg hover:bg-line/60" />
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
          {cover ? (
            <div className="group relative -mx-4 sm:mx-0 w-[calc(100%+2rem)] sm:w-full overflow-hidden rounded-none sm:rounded-xl border-y sm:border border-line bg-subtle">
              <div className="absolute inset-x-0 top-0 z-[1] bg-gradient-to-b from-black/85 via-black/55 to-transparent px-4 pt-3 pb-10 sm:px-5 sm:pt-4 sm:pb-12 pointer-events-none">
                <h1
                  id="abstract-modal-title"
                  className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug pr-12 [&_.rich-text-inline]:text-white"
                >
                  <RichText content={abstract.title} disableContainer className="rich-text-inline" />
                </h1>
              </div>
              <button
                type="button"
                onClick={() => onOpenPhoto(0)}
                className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
                aria-label={
                  gallerySlides.length > 1
                    ? `Open photo gallery, ${gallerySlides.length} photos`
                    : 'Open photo'
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cover.url}
                  alt={cover.alt}
                  className="w-full max-h-[min(56vw,18rem)] sm:max-h-[22rem] object-contain bg-subtle transition-transform duration-200 group-hover:scale-[1.01]"
                />
              </button>
              {cover.caption ? (
                <div className="absolute inset-x-0 bottom-0 z-[1] bg-gradient-to-t from-black/85 via-black/55 to-transparent px-4 pt-10 pb-3 sm:px-5 sm:pt-12 sm:pb-4 pointer-events-none">
                  <p className="text-xs sm:text-sm text-white/95 italic leading-snug">
                    {cover.caption}
                  </p>
                </div>
              ) : null}
              {gallerySlides.length > 1 ? (
                <span className="absolute top-3 right-3 z-[2] inline-flex items-center gap-1.5 rounded-full bg-fg/80 px-2.5 py-1 text-xs font-semibold text-page pointer-events-none">
                  <Images className="w-3.5 h-3.5" aria-hidden="true" />
                  {gallerySlides.length}
                </span>
              ) : null}
            </div>
          ) : (
            <div>
              <h1
                id="abstract-modal-title"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-fg leading-snug"
              >
                <RichText content={abstract.title} disableContainer className="rich-text-inline" />
              </h1>
            </div>
          )}

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
                      {photo ? (
                        <button
                          type="button"
                          onClick={() => openAuthorPhoto(row.person.id)}
                          className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-brand-soft-fg shrink-0 overflow-hidden font-bold text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                          aria-label={`Open photo of ${personName(row.person)}`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-brand-soft-fg shrink-0 overflow-hidden font-bold text-sm">
                          <User className="w-5 h-5 text-brand" />
                        </div>
                      )}
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
              <h2 className="text-xs font-bold uppercase tracking-wider text-fg-subtle mb-3">
                Authors & Affiliations
              </h2>
              <ul className="space-y-2">
                {authors.map((row) => {
                  const instName = personInstitution(row.person)
                  const photo = mediaUrl(row.person.photo)
                  const authorPhotoIndex = abstractAuthorSlideIndex(
                    gallerySlides,
                    row.person.id,
                  )
                  const personId = String(row.person.id)
                  const isExpanded = expandedAuthorId === personId
                  const roleLabel = AUTHOR_ROLE_LABEL[row.role] || row.role

                  return (
                    <li
                      key={row.person.id}
                      className="rounded-xl border border-line/80 bg-subtle/60 overflow-hidden"
                    >
                      <div className="flex items-center gap-1 px-1 py-1">
                        {photo && authorPhotoIndex != null ? (
                          <button
                            type="button"
                            onClick={() => openAuthorPhoto(row.person.id)}
                            className="w-8 h-8 m-1.5 rounded-full overflow-hidden shrink-0 bg-line focus:outline-none focus:ring-2 focus:ring-brand"
                            aria-label={`Open photo of ${personName(row.person)}`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={photo}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ) : (
                          <span className="w-8 h-8 m-1.5 rounded-full bg-line flex items-center justify-center shrink-0">
                            <User className="w-4 h-4 text-fg-subtle" />
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedAuthorId(isExpanded ? null : personId)
                          }
                          aria-expanded={isExpanded}
                          className="min-w-0 flex-1 flex items-center gap-2.5 min-h-11 px-2 py-2 text-left text-sm hover:bg-subtle rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block font-semibold text-fg leading-snug">
                              {personName(row.person)}
                            </span>
                            <span className="block text-xs text-fg-subtle mt-0.5">{roleLabel}</span>
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 shrink-0 text-fg-subtle transition-transform ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </div>
                      {isExpanded ? (
                        <div className="px-3 pb-3 pt-0 space-y-2 border-t border-line/70">
                          <p className="flex items-start gap-1.5 text-xs text-fg-muted pt-2">
                            <Building2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-brand" />
                            <span>{instName || 'No affiliation listed'}</span>
                          </p>
                          {row.person.bio ? (
                            <div className="text-xs text-fg-muted leading-relaxed">
                              <RichText content={row.person.bio} />
                            </div>
                          ) : (
                            <p className="text-xs text-fg-subtle italic">No biography available.</p>
                          )}
                        </div>
                      ) : null}
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

        </div>

        <div className="px-4 sm:px-6 py-3.5 border-t border-line bg-subtle flex flex-col-reverse sm:flex-row sm:justify-between gap-2 shrink-0 pb-[max(0.875rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => {
              onClose()
              scrollToAppendixAbstract(abstract.id)
            }}
            className="sm:hidden w-full min-h-11 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-line bg-surface text-sm font-semibold text-fg-muted hover:text-fg hover:bg-subtle transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <List className="w-4 h-4" aria-hidden />
            View in appendix
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto sm:ml-auto min-h-11 px-5 py-2 rounded-lg bg-fg text-page text-sm font-medium hover:opacity-90 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-brand"
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
