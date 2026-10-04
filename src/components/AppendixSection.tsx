'use client'

import React, { useState } from 'react'
import { RichText } from './RichText'
import { Building2, BookOpen, ExternalLink, FileText, Users, FlaskConical } from 'lucide-react'
import { useModal } from '@/context/ModalContext'
import type { Abstract, Appendix, Institution } from '@/payload-types'
import { abstractStatusLabel } from '@/utilities/conferenceUi'

export interface AppendixSectionProps {
  abstracts: Abstract[]
  appendix: Appendix | null
}

type TabId = 'abstracts' | string

export function AppendixSection({ abstracts, appendix }: AppendixSectionProps) {
  const { openAbstractModal } = useModal()
  const blocks = appendix?.blocks ?? []
  const [activeTab, setActiveTab] = useState<TabId>('abstracts')

  const tabClass = (id: TabId) =>
    `px-4 py-2.5 text-sm font-semibold rounded-t-xl border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
      activeTab === id
        ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
        : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
    }`

  return (
    <section
      id="appendix"
      className="scroll-mt-10 md:scroll-mt-20 py-12 sm:py-16 border-t border-slate-200"
    >
      <div className="mb-8 pb-4 border-b border-slate-200">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          Supplementary Documentation
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Conference Appendix
        </h2>
      </div>

      <div
        className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1 mb-8"
        role="tablist"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'abstracts'}
          onClick={() => setActiveTab('abstracts')}
          className={tabClass('abstracts')}
        >
          <BookOpen className="w-4 h-4" />
          <span>Scientific Abstracts ({abstracts.length})</span>
        </button>

        {blocks.map((block, index) => {
          const id = block.id || `${block.blockType}-${index}`
          const Icon =
            block.blockType === 'institutions'
              ? Building2
              : block.blockType === 'reviewers'
                ? Users
                : block.blockType === 'researchProjects'
                  ? FlaskConical
                  : FileText
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={tabClass(id)}
            >
              <Icon className="w-4 h-4" />
              <span>{block.title}</span>
            </button>
          )
        })}
      </div>

      {activeTab === 'abstracts' && (
        <div role="tabpanel" className="space-y-4">
          {abstracts.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No published abstracts yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {abstracts.map((abs) => (
                <div
                  key={abs.id}
                  onClick={() => openAbstractModal(abs)}
                  className="p-5 rounded-xl border border-slate-200/90 bg-white hover:border-emerald-500 hover:shadow-md cursor-pointer transition-all duration-150 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                        {abs.code || 'ABSTRACT'}
                      </span>
                      {abstractStatusLabel(abs.status) && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded bg-emerald-700">
                          {abstractStatusLabel(abs.status)}
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-slate-900 leading-snug">
                      <RichText content={abs.title} />
                    </h4>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      {Array.isArray(abs.authors)
                        ? `${abs.authors.length} Authors`
                        : 'Authors linked'}
                    </span>
                    <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
                      Read Full Details <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {blocks.map((block, index) => {
        const id = block.id || `${block.blockType}-${index}`
        if (activeTab !== id) return null

        if (block.blockType === 'institutions') {
          const institutions = Array.isArray(block.institutions)
            ? block.institutions.filter((item): item is Institution => typeof item === 'object')
            : []
          return (
            <div key={id} role="tabpanel" className="space-y-4">
              {block.description && (
                <div className="text-sm text-slate-600 mb-4">
                  <RichText content={block.description} />
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {institutions.map((inst) => {
                  const countryName =
                    typeof inst.country === 'object' ? inst.country?.name : ''
                  const regionName =
                    typeof inst.region === 'object' && inst.region ? inst.region.name : ''
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
                        {inst.description && (
                          <div className="text-xs text-slate-600 mt-2 line-clamp-3">
                            <RichText content={inst.description} />
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        }

        return (
          <div key={id} role="tabpanel" className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-3">{block.title}</h3>
            {block.description ? (
              <div className="text-sm text-slate-700 leading-relaxed">
                <RichText content={block.description} />
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">Content for this section is coming soon.</p>
            )}
          </div>
        )
      })}
    </section>
  )
}
