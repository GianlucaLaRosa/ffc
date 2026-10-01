'use client'

import React, { useEffect } from 'react'
import { RichText } from './RichText'
import { X, Building2, User, Sparkles } from './IconRenderer'

export interface AbstractModalProps {
  abstract: any | null
  isOpen: boolean
  onClose: () => void
}

export function AbstractModal({ abstract, isOpen, onClose }: AbstractModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
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
  }, [isOpen, onClose])

  if (!isOpen || !abstract) return null

  // Extract authors
  const authors = Array.isArray(abstract.authors) ? abstract.authors : []

  // Extract main speakers
  const mainSpeakerItems = Array.isArray(abstract.mainSpeakers) ? abstract.mainSpeakers : []
  const mainSpeakerIds = new Set(
    mainSpeakerItems
      .filter((m: any) => m.isMain)
      .map((m: any) => (typeof m.speaker === 'object' ? m.speaker?.id : m.speaker)),
  )

  const speakers = Array.isArray(abstract.speakers) ? abstract.speakers : []

  // Extract content sections
  const contentSections = Array.isArray(abstract.content) ? abstract.content : []

  // Extract photos
  const photos = Array.isArray(abstract.photos) ? abstract.photos : []

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/80 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="abstract-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl h-full sm:h-[88vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/90 backdrop-blur shrink-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            {abstract.code && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {abstract.code}
              </span>
            )}
            {abstract.status && typeof abstract.status === 'object' && (
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white"
                style={{
                  backgroundColor: abstract.status.color || '#3b82f6',
                }}
              >
                {abstract.status.name}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Close abstract details modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-8">
          {/* Title */}
          <div>
            <h1
              id="abstract-modal-title"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-snug"
            >
              <RichText content={abstract.title} />
            </h1>
          </div>

          {/* Speakers Section */}
          {speakers.length > 0 && (
            <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50/40 border border-emerald-100/80">
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Featured Presenters & Speakers
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {speakers.map((sp: any, i: number) => {
                  const isMain = mainSpeakerIds.has(sp.id)
                  const inst = sp.institution
                  const instName =
                    typeof inst === 'object' ? inst?.name : inst || 'Independent Researcher'
                  return (
                    <div
                      key={i}
                      className={`p-3.5 rounded-lg border bg-white flex items-start gap-3 shadow-xs ${
                        isMain
                          ? 'border-emerald-300 ring-2 ring-emerald-500/20'
                          : 'border-slate-200'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0 overflow-hidden font-bold text-sm">
                        {sp.photo?.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={sp.photo.url}
                            alt={`${sp.firstName} ${sp.lastName}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-emerald-700" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-slate-900 text-sm">
                            {sp.firstName} {sp.lastName}
                          </span>
                          {isMain && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white uppercase tracking-wider">
                              Main Speaker
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{instName}</p>
                        {sp.bio && (
                          <div className="text-xs text-slate-600 mt-2 line-clamp-3">
                            <RichText content={sp.bio} />
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Authors List */}
          {authors.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Authors & Affiliations
              </h2>
              <ul className="flex flex-wrap gap-2 text-sm text-slate-700">
                {authors.map((author: any, i: number) => {
                  const inst = author.institution
                  const instName = typeof inst === 'object' ? inst?.name : inst || ''
                  return (
                    <li
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-xs font-medium text-slate-800"
                    >
                      <span>
                        {author.firstName} {author.lastName}
                      </span>
                      {instName && (
                        <span className="text-slate-400 flex items-center gap-0.5">
                          • <Building2 className="w-3 h-3 inline" /> {instName}
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {/* Content Sections */}
          {contentSections.length > 0 && (
            <div className="space-y-6 pt-2">
              {contentSections.map((sec: any, i: number) => (
                <section
                  key={i}
                  className="p-5 rounded-xl bg-slate-50/70 border border-slate-200/80"
                >
                  {sec.title && (
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-2.5 pb-2 border-b border-slate-200">
                      {sec.title}
                    </h3>
                  )}
                  <div className="text-sm text-slate-700 leading-relaxed">
                    <RichText content={sec.description} />
                  </div>
                </section>
              ))}
            </div>
          )}

          {/* Media & Figures Gallery */}
          {photos.length > 0 && (
            <div className="pt-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Figures, Charts & Media
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {photos.map((item: any, i: number) => {
                  const imgUrl = item.url || `/api/media/file/${item.filename}`
                  return (
                    <figure
                      key={i}
                      className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 flex flex-col"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgUrl}
                        alt={item.alt || 'Scientific figure'}
                        className="w-full h-52 object-cover"
                        loading="lazy"
                      />
                      {item.caption && (
                        <figcaption className="p-3 text-xs text-slate-600 bg-white border-t border-slate-100 italic">
                          <RichText content={item.caption} />
                        </figcaption>
                      )}
                    </figure>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
