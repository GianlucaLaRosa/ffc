'use client'

import React, { useState } from 'react'
import { RichText } from './RichText'
import { Building2, User, BookOpen, ExternalLink } from 'lucide-react'
import { AbstractModal } from './AbstractModal'

export interface AppendixSectionProps {
  abstracts: any[]
  institutions: any[]
  people: any[]
}

export function AppendixSection({ abstracts, institutions, people }: AppendixSectionProps) {
  const [activeTab, setActiveTab] = useState<'abstracts' | 'institutions' | 'people'>('abstracts')
  const [selectedAbstract, setSelectedAbstract] = useState<any | null>(null)

  return (
    <section id="appendix" className="scroll-mt-20 py-12 sm:py-16 border-t border-slate-200">
      <div className="mb-8 pb-4 border-b border-slate-200">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          Supplementary Documentation
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Conference Appendix
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1 mb-8" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'abstracts'}
          aria-controls="appendix-panel-abstracts"
          onClick={() => setActiveTab('abstracts')}
          className={`px-4 py-2.5 text-sm font-semibold rounded-t-xl border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'abstracts'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Appendix 1: Scientific Abstracts ({abstracts.length})</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'institutions'}
          aria-controls="appendix-panel-institutions"
          onClick={() => setActiveTab('institutions')}
          className={`px-4 py-2.5 text-sm font-semibold rounded-t-xl border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'institutions'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Appendix 2: Research Institutions ({institutions.length})</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'people'}
          aria-controls="appendix-panel-people"
          onClick={() => setActiveTab('people')}
          className={`px-4 py-2.5 text-sm font-semibold rounded-t-xl border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'people'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Appendix 3: Researchers & Speakers ({people.length})</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {/* Appendix 1: Abstracts */}
        {activeTab === 'abstracts' && (
          <div id="appendix-panel-abstracts" role="tabpanel" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {abstracts.map((abs) => (
                <div
                  key={abs.id}
                  onClick={() => setSelectedAbstract(abs)}
                  className="p-5 rounded-xl border border-slate-200/90 bg-white hover:border-emerald-500 hover:shadow-md cursor-pointer transition-all duration-150 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                        {abs.code || 'ABSTRACT'}
                      </span>
                      {abs.status?.name && (
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded"
                          style={{ backgroundColor: abs.status.color || '#3b82f6' }}
                        >
                          {abs.status.name}
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-slate-900 leading-snug">
                      <RichText content={abs.title} />
                    </h4>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      {Array.isArray(abs.authors) ? `${abs.authors.length} Authors` : 'Authors linked'}
                    </span>
                    <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
                      Read Full Details <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Appendix 2: Institutions */}
        {activeTab === 'institutions' && (
          <div id="appendix-panel-institutions" role="tabpanel" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {institutions.map((inst) => {
                const countryName =
                  typeof inst.country === 'object' ? inst.country?.name : inst.country || ''
                const regionName =
                  typeof inst.region === 'object' ? inst.region?.name : inst.region || ''

                return (
                  <div
                    key={inst.id}
                    className="p-4 rounded-xl border border-slate-200/90 bg-white shadow-2xs flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">{inst.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {[regionName, countryName].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Appendix 3: People */}
        {activeTab === 'people' && (
          <div id="appendix-panel-people" role="tabpanel" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {people.map((p) => {
                const instName =
                  typeof p.institution === 'object'
                    ? p.institution?.name
                    : p.institution || 'Affiliated Researcher'

                return (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl border border-slate-200/90 bg-white shadow-2xs flex items-start gap-3.5"
                  >
                    <div className="w-11 h-11 rounded-full bg-emerald-100/70 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
                      {p.photo?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.photo.url}
                          alt={`${p.firstName} ${p.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-emerald-700" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-900 text-sm">
                        {p.firstName} {p.lastName}
                      </h4>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{instName}</p>
                      {p.bio && (
                        <div className="text-xs text-slate-600 mt-2 line-clamp-2">
                          <RichText content={p.bio} />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Abstract Modal */}
      <AbstractModal
        abstract={selectedAbstract}
        isOpen={Boolean(selectedAbstract)}
        onClose={() => setSelectedAbstract(null)}
      />
    </section>
  )
}
