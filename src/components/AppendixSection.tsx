'use client'

import React, { useEffect, useId, useMemo, useRef, useState } from 'react'
import { hasVisibleLayoutBlocks, LayoutBlocks } from '@/components/LayoutBlocks'
import { SessionIcon, ChevronDown } from '@/components/IconRenderer'
import { RichText } from './RichText'
import { Search, X } from 'lucide-react'
import { useModal } from '@/context/ModalContext'
import type { Abstract, Appendix, Institution } from '@/payload-types'
import {
  abstractAppendixRows,
  researchProjectsBlockTabId,
  type AbstractAppendixRow,
  type AgendaIconValue,
} from '@/utilities/conferenceUi'
import { groupInstitutionsForDisplay } from '@/utilities/groupInstitutions'
import {
  APPENDIX_ABSTRACT_FOCUS_EVENT,
  type AppendixAbstractFocusDetail,
} from '@/utilities/appendixNavigation'

export interface AppendixSectionProps {
  abstracts: Abstract[]
  appendix: Appendix | null
}

type TabId = string

type AppendixBlock = NonNullable<Appendix['blocks']>[number]

type TabOption = {
  id: TabId
  label: string
  icon: AgendaIconValue
}

type AppendixListEntry = {
  id: string
  abstract: Abstract
  row: AbstractAppendixRow
}

function blockTabId(block: AppendixBlock, index: number): TabId {
  return block.id || `${block.blockType}-${index}`
}

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

function flattenAppendixEntries(abstracts: Abstract[]): AppendixListEntry[] {
  return abstracts.flatMap((abs) => {
    const rows = abstractAppendixRows(abs)
    return rows.map((row, rowIndex) => ({
      id: `${abs.id}:${row.id || rowIndex}`,
      abstract: abs,
      row,
    }))
  })
}

function appendixEntryTitle(entry: AppendixListEntry): string {
  const title = typeof entry.row.title === 'string' ? entry.row.title.trim() : ''
  if (title) return title
  const code = typeof entry.abstract.code === 'string' ? entry.abstract.code.trim() : ''
  return code || entry.abstract.plainTitle || 'Appendix entry'
}

/** Site header (4rem / 5rem) + appendix title and tab bar when scrolling to an entry. */
const appendixEntryScrollMargin =
  'scroll-mt-[calc(4rem+env(safe-area-inset-top)+13rem)] sm:scroll-mt-[calc(5rem+env(safe-area-inset-top)+12rem)]'

const appendixStickyTop =
  'top-[calc(4rem+env(safe-area-inset-top))] sm:top-[calc(5rem+env(safe-area-inset-top))]'

function appendixEntrySearchText(entry: AppendixListEntry): string {
  const code = typeof entry.abstract.code === 'string' ? entry.abstract.code : ''
  const plainTitle =
    typeof entry.abstract.plainTitle === 'string' ? entry.abstract.plainTitle : ''
  const title = typeof entry.row.title === 'string' ? entry.row.title : ''
  return `${title} ${code} ${plainTitle}`.toLowerCase()
}

type AppendixEntriesPanelProps = {
  entries: AppendixListEntry[]
  filteredEntries: AppendixListEntry[]
  searchQuery: string
  onSearchQueryChange: (value: string) => void
  highlightId: string | null
  expandedEntryId: string | null
  onToggleExpanded: (entryId: string) => void
  onOpenAbstract: (abstract: Abstract) => void
}

function AppendixEntriesPanel({
  entries,
  filteredEntries,
  searchQuery,
  onSearchQueryChange,
  highlightId,
  expandedEntryId,
  onToggleExpanded,
  onOpenAbstract,
}: AppendixEntriesPanelProps) {
  const searchInputId = useId()

  if (entries.length === 0) {
    return (
      <p className="text-sm text-fg-subtle italic">No published appendix entries yet.</p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <label htmlFor={searchInputId} className="sr-only">
          Search appendix entries by title or code
        </label>
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-subtle"
          aria-hidden
        />
        <input
          id={searchInputId}
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder="Search appendix entries…"
          className="w-full min-h-11 pl-10 pr-10 py-2.5 rounded-xl border border-line bg-surface text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-brand"
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={() => onSearchQueryChange('')}
            aria-label="Clear search"
            className="absolute right-1 top-1/2 -translate-y-1/2 inline-flex size-9 items-center justify-center rounded-lg text-fg-subtle hover:bg-subtle hover:text-fg"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      {filteredEntries.length === 0 ? (
        <p className="text-sm text-fg-muted py-6 text-center">
          No appendix entries match &ldquo;{searchQuery.trim()}&rdquo;.
        </p>
      ) : (
        <ul className="divide-y divide-line rounded-xl border border-line/90 bg-surface overflow-hidden">
          {filteredEntries.map((entry) => {
            const title = appendixEntryTitle(entry)
            const isHighlighted = highlightId === entry.id
            const isExpanded = expandedEntryId === entry.id

            return (
              <li
                key={entry.id}
                id={`appendix-entry-${entry.id}`}
                className={`${appendixEntryScrollMargin} transition-colors ${
                  isHighlighted ? 'bg-brand-soft/70 ring-2 ring-inset ring-brand/40' : ''
                }`}
              >
                <button
                  type="button"
                  onClick={() => onToggleExpanded(entry.id)}
                  aria-expanded={isExpanded}
                  aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${title}`}
                  className="w-full flex items-center gap-3 min-h-11 px-4 py-3 text-left hover:bg-subtle/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
                >
                  <span className="min-w-0 flex-1 text-sm font-semibold text-fg leading-snug">
                    {title}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 text-fg-subtle transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isExpanded ? (
                  <div className="px-4 sm:px-5 pb-4 border-t border-line/70 bg-subtle/30">
                    {entry.row.body ? (
                      <div className="pt-3 text-sm text-fg-muted leading-relaxed">
                        <RichText content={entry.row.body} />
                      </div>
                    ) : (
                      <p className="pt-3 text-sm text-fg-subtle italic">
                        No appendix body for this entry yet.
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => onOpenAbstract(entry.abstract)}
                      className="mt-3 text-sm font-semibold text-brand-soft-fg hover:text-brand hover:underline underline-offset-2"
                    >
                      View full abstract details
                    </button>
                  </div>
                ) : null}
              </li>
            )
          })}
        </ul>
      )}

      {searchQuery.trim() ? (
        <p className="text-xs text-fg-subtle text-center">
          {filteredEntries.length} of {entries.length} entries
        </p>
      ) : null}
    </div>
  )
}

export function AppendixSection({ abstracts, appendix }: AppendixSectionProps) {
  const { openAbstractModal } = useModal()
  const blocks = appendix?.blocks ?? []
  const [activeTab, setActiveTab] = useState<TabId>(() =>
    blocks[0] ? blockTabId(blocks[0], 0) : '',
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [tabMenuOpen, setTabMenuOpen] = useState(false)
  const [highlightId, setHighlightId] = useState<string | null>(null)
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null)
  const tabMenuRef = useRef<HTMLDivElement>(null)

  const researchProjectsTabId = useMemo(
    () => researchProjectsBlockTabId(appendix),
    [appendix],
  )

  const tabs = useMemo<TabOption[]>(
    () =>
      blocks.map((block, index) => ({
        id: blockTabId(block, index),
        label: block.title,
        icon: tabIcon(block),
      })),
    [blocks],
  )

  const activeTabOption = tabs.find((tab) => tab.id === activeTab) ?? tabs[0]

  const appendixEntries = useMemo(() => flattenAppendixEntries(abstracts), [abstracts])

  const filteredEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return appendixEntries
    return appendixEntries.filter((entry) => appendixEntrySearchText(entry).includes(query))
  }, [appendixEntries, searchQuery])

  useEffect(() => {
    if (!tabMenuOpen) return

    const onPointerDown = (event: MouseEvent) => {
      if (tabMenuRef.current && !tabMenuRef.current.contains(event.target as Node)) {
        setTabMenuOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setTabMenuOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [tabMenuOpen])

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<AppendixAbstractFocusDetail>).detail
      if (!detail?.abstractId || !researchProjectsTabId) return

      setActiveTab(researchProjectsTabId)
      setTabMenuOpen(false)
      const matchingEntry =
        appendixEntries.find((entry) => String(entry.abstract.id) === detail.abstractId) ??
        appendixEntries.find((entry) => entry.id.startsWith(`${detail.abstractId}:`))

      if (matchingEntry) {
        setHighlightId(matchingEntry.id)
        if (detail.expand !== false) {
          setExpandedEntryId(matchingEntry.id)
        }
      }

      window.setTimeout(() => {
        const scrollId = matchingEntry
          ? `appendix-entry-${matchingEntry.id}`
          : `appendix-abstract-${detail.abstractId}`
        document.getElementById(scrollId)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 120)

      if (detail.openModal) {
        const match = abstracts.find((abs) => String(abs.id) === detail.abstractId)
        if (match) openAbstractModal(match)
      }

      window.setTimeout(() => setHighlightId(null), 2400)
    }

    window.addEventListener(APPENDIX_ABSTRACT_FOCUS_EVENT, handler)
    return () => window.removeEventListener(APPENDIX_ABSTRACT_FOCUS_EVENT, handler)
  }, [abstracts, appendixEntries, openAbstractModal, researchProjectsTabId])

  const selectTab = (id: TabId) => {
    setActiveTab(id)
    setTabMenuOpen(false)
  }

  const tabClass = (id: TabId) =>
    `px-4 py-3 min-h-11 text-sm font-semibold rounded-t-xl border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
      activeTab === id
        ? 'border-brand text-brand-soft-fg bg-brand-soft/50'
        : 'border-transparent text-fg-subtle hover:text-fg hover:bg-subtle'
    }`

  return (
    <section
      id="appendix"
      className="scroll-mt-24 sm:scroll-mt-28 pt-10 sm:pt-16 pb-10 sm:pb-16 border-t border-line"
    >
      <div
        className={`sticky ${appendixStickyTop} z-20 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 pt-1 pb-4 mb-8 bg-page/95 backdrop-blur-md border-b border-line shadow-xs`}
      >
        <div className="mb-4 pb-4 border-b border-line/70">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-soft-fg">
            Supplementary Documentation
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-fg tracking-tight mt-1">
            Conference Appendix
          </h2>
        </div>

        <div className="md:hidden relative" ref={tabMenuRef}>
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={tabMenuOpen}
            onClick={() => setTabMenuOpen((open) => !open)}
            className="w-full flex items-center justify-between gap-3 min-h-11 px-4 py-3 rounded-xl border border-line bg-surface text-sm font-semibold text-fg shadow-xs"
          >
            <span className="inline-flex items-center gap-2 min-w-0">
              <SessionIcon name={activeTabOption.icon} className="w-4 h-4 shrink-0 text-brand" />
              <span className="truncate">{activeTabOption.label}</span>
            </span>
            <ChevronDown
              className={`w-4 h-4 shrink-0 text-fg-subtle transition-transform ${tabMenuOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {tabMenuOpen ? (
            <ul
              role="listbox"
              aria-label="Appendix sections"
              className="absolute z-30 mt-1 w-full max-h-64 overflow-y-auto rounded-xl border border-line bg-surface shadow-lg py-1"
            >
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={activeTab === tab.id}
                    onClick={() => selectTab(tab.id)}
                    className={`w-full flex items-center gap-2 px-4 py-3 min-h-11 text-left text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-brand-soft text-brand-soft-fg'
                        : 'text-fg hover:bg-subtle'
                    }`}
                  >
                    <SessionIcon name={tab.icon} className="w-4 h-4 shrink-0" />
                    <span className="min-w-0">{tab.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div
          className="hidden md:flex flex-wrap gap-x-2 gap-y-1 pt-4 -mb-1"
          role="tablist"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => selectTab(tab.id)}
              className={tabClass(tab.id)}
            >
              <SessionIcon name={tab.icon} className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {blocks.map((block, index) => {
        const id = blockTabId(block, index)
        if (activeTab !== id) return null

        if (block.blockType === 'researchProjects') {
          return (
            <div key={id} role="tabpanel" className="space-y-6">
              {block.description ? (
                <div className="text-sm text-fg-muted leading-relaxed">
                  <RichText content={block.description} />
                </div>
              ) : null}
              <AppendixEntriesPanel
                entries={appendixEntries}
                filteredEntries={filteredEntries}
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                highlightId={highlightId}
                expandedEntryId={expandedEntryId}
                onToggleExpanded={(entryId) =>
                  setExpandedEntryId((prev) => (prev === entryId ? null : entryId))
                }
                onOpenAbstract={openAbstractModal}
              />
            </div>
          )
        }

        if (block.blockType === 'institutions') {
          const institutions = Array.isArray(block.institutions)
            ? block.institutions.filter((item): item is Institution => typeof item === 'object')
            : []
          const countryGroups = groupInstitutionsForDisplay(institutions)
          return (
            <div key={id} role="tabpanel" className="space-y-6">
              {block.description && (
                <div className="text-sm text-fg-muted mb-4">
                  <RichText content={block.description} />
                </div>
              )}
              {countryGroups.map((group) => (
                <section key={group.countryName || 'unknown-country'} className="space-y-4">
                  {group.countryName ? (
                    <h3 className="text-lg font-extrabold text-brand-soft-fg tracking-tight">
                      {group.countryName}
                    </h3>
                  ) : null}
                  {group.regions.map((region) => (
                    <div
                      key={region.regionName ?? `${group.countryName}-unspecified`}
                      className="space-y-3"
                    >
                      {group.isItaly && region.regionName ? (
                        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-soft-fg">
                          {region.regionName}
                        </h4>
                      ) : null}
                      <ul className="columns-1 sm:columns-2 lg:columns-3 gap-x-8 [column-fill:_balance]">
                        {region.institutions.map((inst) => (
                          <li
                            key={inst.id}
                            className="break-inside-avoid mb-3 pl-3 border-l-2 border-brand/30"
                          >
                            <p className="text-sm font-semibold text-fg leading-snug">{inst.name}</p>
                            {inst.description ? (
                              <div className="text-xs text-fg-muted mt-1 leading-relaxed line-clamp-3">
                                <RichText content={inst.description} />
                              </div>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              ))}
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
