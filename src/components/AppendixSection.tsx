'use client'

import React, { useState } from 'react'
import { hasVisibleLayoutBlocks, LayoutBlocks } from '@/components/LayoutBlocks'
import { SessionIcon } from '@/components/IconRenderer'
import { RichText } from './RichText'
import { BookOpen, Building2, ExternalLink } from 'lucide-react'
import { useModal } from '@/context/ModalContext'
import type { Abstract, Appendix, Institution } from '@/payload-types'
import { abstractStatusLabel, type AgendaIconValue } from '@/utilities/conferenceUi'

export interface AppendixSectionProps {
  abstracts: Abstract[]
  appendix: Appendix | null
}

type TabId = 'abstracts' | string

type AppendixBlock = NonNullable<Appendix['blocks']>[number]

function defaultTabIcon(blockType: AppendixBlock['blockType']): AgendaIconValue {
  switch (blockType) {
    case 'institutions':
      return 'building'
    case 'reviewers':
      return 'users'
    case 'researchProjects':
      return 'flask-conical'
    default:
      return 'file-text'
  }
}

function tabIcon(block: AppendixBlock): AgendaIconValue {
  if (block.icon?.name) return block.icon
  return defaultTabIcon(block.blockType)
}

export function AppendixSection({ abstracts, appendix }: AppendixSectionProps) {
  const { openAbstractModal } = useModal()
  const blocks = appendix?.blocks ?? []
  const [activeTab, setActiveTab] = useState<TabId>('abstracts')

  const tabClass = (id: TabId) =>
    `px-4 py-3 min-h-11 text-sm font-semibold rounded-t-xl border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
      activeTab === id
        ? 'border-brand text-brand-soft-fg bg-brand-soft/50'
        : 'border-transparent text-fg-subtle hover:text-fg hover:bg-subtle'
    }`

  return (
    <section
      id="appendix"
      className="scroll-mt-24 sm:scroll-mt-28 py-10 sm:py-16 border-t border-line"
    >
      <div className="mb-8 pb-4 border-b border-line">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-soft-fg">
          Supplementary Documentation
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-fg tracking-tight mt-1">
          Conference Appendix
        </h2>
      </div>

      <div
        className="flex border-b border-line gap-2 overflow-x-auto overscroll-x-contain pb-1 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0"
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
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={tabClass(id)}
            >
              <SessionIcon name={tabIcon(block)} className="w-4 h-4" />
              <span>{block.title}</span>
            </button>
          )
        })}
      </div>

      {activeTab === 'abstracts' && (
        <div role="tabpanel" className="space-y-4">
          {abstracts.length === 0 ? (
            <p className="text-sm text-fg-subtle italic">No published abstracts yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {abstracts.map((abs) => (
                <div
                  key={abs.id}
                  onClick={() => openAbstractModal(abs)}
                  className="p-5 rounded-xl border border-line/90 bg-surface hover:border-brand hover:shadow-md cursor-pointer transition-all duration-150 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-brand-soft-fg bg-brand-soft px-2.5 py-0.5 rounded-md border border-brand-border">
                        {abs.code || 'ABSTRACT'}
                      </span>
                      {abstractStatusLabel(abs.status) && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-fg px-2 py-0.5 rounded bg-brand">
                          {abstractStatusLabel(abs.status)}
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-fg leading-snug">
                      <RichText content={abs.title} disableContainer className="rich-text-inline" />
                    </h4>
                  </div>

                  <div className="mt-4 pt-3 border-t border-line flex items-center justify-between gap-2 text-xs text-fg-subtle">
                    <span>
                      {Array.isArray(abs.authors)
                        ? `${abs.authors.length} Authors`
                        : 'Authors linked'}
                    </span>
                    <span className="text-brand font-semibold inline-flex items-center gap-1 shrink-0">
                      Read <span className="hidden sm:inline">Full Details</span>{' '}
                      <ExternalLink className="w-3 h-3" />
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
                <div className="text-sm text-fg-muted mb-4">
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
                      className="p-4 rounded-xl border border-line/90 bg-surface shadow-2xs flex items-start gap-3"
                    >
                      <div className="w-9 h-9 rounded-lg bg-subtle text-fg-muted flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-fg text-sm">{inst.name}</h4>
                        <p className="text-xs text-fg-subtle mt-0.5">
                          {[regionName, countryName].filter(Boolean).join(', ')}
                        </p>
                        {inst.description && (
                          <div className="text-xs text-fg-muted mt-2 line-clamp-3">
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

        if (block.blockType === 'basicText') {
          return (
            <div key={id} role="tabpanel" className="space-y-6">
              {hasVisibleLayoutBlocks(block.layout) ? (
                <LayoutBlocks blocks={block.layout} compact />
              ) : (
                <p className="text-sm text-fg-subtle italic">Content for this section is coming soon.</p>
              )}
            </div>
          )
        }

        return (
          <div key={id} role="tabpanel" className="rounded-2xl border border-line bg-surface p-6">
            <h3 className="text-lg font-bold text-fg mb-3">{block.title}</h3>
            {block.description ? (
              <div className="text-sm text-fg-muted leading-relaxed">
                <RichText content={block.description} />
              </div>
            ) : (
              <p className="text-sm text-fg-subtle italic">Content for this section is coming soon.</p>
            )}
          </div>
        )
      })}
    </section>
  )
}
