'use client'

import React, { useEffect } from 'react'
import { RichText } from './RichText'
import { X, Building2, User, Sparkles } from './IconRenderer'
import type { Abstract, Media } from '@/payload-types'
import {
  AUTHOR_ROLE_LABEL,
  abstractAuthors,
  abstractStatusLabel,
  mediaUrl,
  personInstitution,
  personName,
} from '@/utilities/conferenceUi'

export interface AbstractModalProps {
  abstract: Abstract | null
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

  const authors = abstractAuthors(abstract)
  const speakers = authors.filter((row) => row.isSpeaker)
  const contentSections = Array.isArray(abstract.content) ? abstract.content : []
  const pictures = Array.isArray(abstract.picture) ? abstract.picture : []
  const relatedCodes = Array.isArray(abstract.relatedCodes) ? abstract.relatedCodes : []
  const appendices = Array.isArray(abstract.appendices) ? abstract.appendices : []

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
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/90 backdrop-blur shrink-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            {abstract.code && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {abstract.code}
              </span>
            )}
            {abstractStatusLabel(abstract.status) && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-emerald-700">
                {abstractStatusLabel(abstract.status)}
              </span>
            )}
            {relatedCodes.map((row) => (
              <span
                key={row.id || row.code}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
              >
                {row.code}
                {abstractStatusLabel(row.status) ? ` · ${abstractStatusLabel(row.status)}` : ''}
              </span>
            ))}
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

        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-8">
          <div>
            <h1
              id="abstract-modal-title"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-snug"
            >
              <RichText content={abstract.title} />
            </h1>
          </div>

          {speakers.length > 0 && (
            <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50/40 border border-emerald-100/80">
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Featured Presenters & Speakers
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {speakers.map((row) => {
                  const instName = personInstitution(row.person) || 'Independent Researcher'
                  const photo = mediaUrl(row.person.photo)
                  return (
                    <div
                      key={row.person.id}
                      className="p-3.5 rounded-lg border bg-white flex items-start gap-3 shadow-xs border-emerald-300 ring-2 ring-emerald-500/20"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0 overflow-hidden font-bold text-sm">
                        {photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={photo}
                            alt={personName(row.person)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-emerald-700" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-slate-900 text-sm">
                            {personName(row.person)}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white uppercase tracking-wider">
                            Speaker
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{instName}</p>
                        {row.person.bio && (
                          <div className="text-xs text-slate-600 mt-2 line-clamp-3">
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
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Authors & Affiliations
              </h2>
              <ul className="flex flex-wrap gap-2 text-sm text-slate-700">
                {authors.map((row) => {
                  const instName = personInstitution(row.person)
                  return (
                    <li
                      key={row.person.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-xs font-medium text-slate-800"
                    >
                      <span>{personName(row.person)}</span>
                      <span className="text-slate-400">
                        {AUTHOR_ROLE_LABEL[row.role] || row.role}
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

          {contentSections.length > 0 && (
            <div className="space-y-6 pt-2">
              {contentSections.map((sec, i) => (
                <section
                  key={sec.id || i}
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

          {appendices.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Abstract appendix
              </h2>
              {appendices.map((row, i) => (
                <section
                  key={row.id || i}
                  className="p-5 rounded-xl border border-slate-200 bg-white"
                >
                  {row.title && (
                    <h3 className="text-sm font-bold text-slate-900 mb-2">{row.title}</h3>
                  )}
                  {row.body && (
                    <div className="text-sm text-slate-700 leading-relaxed">
                      <RichText content={row.body} />
                    </div>
                  )}
                </section>
              ))}
            </div>
          )}

          {pictures.length > 0 && (
            <div className="pt-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Figures, Charts & Media
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pictures.map((item, i) => {
                  const image = item.image as Media | number
                  const imgUrl = mediaUrl(typeof image === 'object' ? image : null)
                  if (!imgUrl) return null
                  return (
                    <figure
                      key={item.id || i}
                      className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 flex flex-col"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgUrl}
                        alt={item.description || 'Scientific figure'}
                        className="w-full h-52 object-cover"
                        loading="lazy"
                      />
                      {item.description && (
                        <figcaption className="p-3 text-xs text-slate-600 bg-white border-t border-slate-100 italic">
                          {item.description}
                        </figcaption>
                      )}
                    </figure>
                  )
                })}
              </div>
            </div>
          )}
        </div>

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
