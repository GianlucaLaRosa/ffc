'use client'

import React, { useEffect, useState } from 'react'
import { RichText } from './RichText'
import { SessionIcon, ChevronDown, Sparkles, Clock } from './IconRenderer'
import { SaveAgendaButton } from './SaveAgendaButton'
import { useModal } from '@/context/ModalContext'
import { useSavedAgenda } from '@/context/SavedAgendaContext'
import type { Abstract, AgendaItem, ConferenceDay } from '@/payload-types'
import {
  abstractStatusLabel,
  formatDayTitle,
  joinDocs,
} from '@/utilities/conferenceUi'
import { formatConferenceTime } from '@/utilities/conferenceTime'
import {
  findAgendaItemLocation,
  isHappeningNow,
  isStartingSoon,
  minutesUntilStart,
} from '@/utilities/savedAgenda'

export interface ProgrammeSectionProps {
  days: ConferenceDay[]
}

export function ProgrammeSection({ days }: ProgrammeSectionProps) {
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({})
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const { focusedItemId, clearFocus, now, isSaved, isReady, leadMinutes } = useSavedAgenda()

  useEffect(() => {
    if (!focusedItemId) return
    const location = findAgendaItemLocation(days, focusedItemId)
    if (!location) {
      clearFocus()
      return
    }

    setExpandedDays((prev) =>
      prev[location.dayId] ? prev : { ...prev, [location.dayId]: true },
    )
    if (location.expandItemIds.length > 0) {
      setExpandedItems((prev) => {
        const missing = location.expandItemIds.filter((id) => !prev[id])
        if (missing.length === 0) return prev
        const next = { ...prev }
        for (const id of missing) next[id] = true
        return next
      })
    }
  }, [clearFocus, days, focusedItemId])

  useEffect(() => {
    if (!focusedItemId) return
    const location = findAgendaItemLocation(days, focusedItemId)
    if (!location) return
    if (!expandedDays[location.dayId]) return
    if (location.expandItemIds.some((id) => !expandedItems[id])) return

    const node = document.getElementById(`agenda-item-${focusedItemId}`)
    if (!node) return
    node.scrollIntoView({ behavior: 'smooth', block: 'center' })
    clearFocus()
  }, [clearFocus, days, expandedDays, expandedItems, focusedItemId])

  const toggleDay = (dayId: string) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayId]: !prev[dayId],
    }))
  }

  const toggleItemChildren = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
  }

  const formatTime = (dateStr?: string | null) => formatConferenceTime(dateStr)

  return (
    <section id="programme" className="scroll-mt-10 md:scroll-mt-20 py-12 sm:py-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-line gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-soft-fg">
            Scientific Schedule
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-fg tracking-tight mt-1">
            Conference Programme
          </h2>
        </div>
      </div>

      <div className="space-y-4">
        {days.map((day) => {
          const isDayOpen = Boolean(expandedDays[day.id])
          const rootItems = joinDocs<AgendaItem>(day.agendaItems)
          const formattedDayDate = formatDayTitle(day)

          return (
            <div
              key={day.id}
              className="border border-line/90 rounded-2xl bg-surface shadow-xs overflow-hidden transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => toggleDay(String(day.id))}
                aria-expanded={isDayOpen}
                aria-controls={`day-content-${day.id}`}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-subtle/80 transition-colors focus:outline-none focus:ring-2 focus:ring-brand/50"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-fg leading-tight">
                      {formattedDayDate}
                    </h3>
                    <p className="text-xs text-fg-subtle font-medium mt-0.5">
                      {formatTime(day.startTime)} – {formatTime(day.endTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-fg-subtle font-medium hidden sm:inline-block">
                    {rootItems.length} {rootItems.length === 1 ? 'session' : 'sessions'}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center bg-subtle text-fg-muted transition-transform duration-200 ${
                      isDayOpen ? 'rotate-180 bg-brand-soft text-brand-soft-fg' : ''
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </div>
              </button>

              {isDayOpen && (
                <div
                  id={`day-content-${day.id}`}
                  className="px-4 sm:px-6 pb-6 pt-2 border-t border-line space-y-3 bg-subtle/40"
                >
                  {rootItems.length === 0 ? (
                    <p className="text-sm text-fg-subtle py-6 text-center italic">
                      No agenda items scheduled for this day yet.
                    </p>
                  ) : (
                    rootItems.map((item) => (
                      <AgendaItemCard
                        key={item.id}
                        item={item}
                        expandedItems={expandedItems}
                        onToggleChildren={toggleItemChildren}
                        formatTime={formatTime}
                        now={now}
                        isReady={isReady}
                        isSaved={isSaved}
                        leadMinutes={leadMinutes}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

function AgendaItemCard({
  item,
  expandedItems,
  onToggleChildren,
  formatTime,
  now,
  isReady,
  isSaved,
  leadMinutes,
  isChild = false,
}: {
  item: AgendaItem
  expandedItems: Record<string, boolean>
  onToggleChildren: (itemId: string, e: React.MouseEvent) => void
  formatTime: (d?: string | null) => string
  now: Date
  isReady: boolean
  isSaved: (item: AgendaItem) => boolean
  leadMinutes: number
  isChild?: boolean
}) {
  const { openAbstractModal } = useModal()
  const linkedAbstracts = joinDocs<Abstract>(item.childAbstracts)
  const children = joinDocs<AgendaItem>(item.children)
  const hasAbstract = linkedAbstracts.length > 0
  const primaryAbstract = linkedAbstracts[0]
  const hasChildren = children.length > 0
  const isKeynote = Boolean(item.isKeynote)
  const isExpanded = Boolean(expandedItems[item.id])
  const live = isReady && isHappeningNow(item, now)
  const soon = isReady && !live && isSaved(item) && isStartingSoon(item, now, leadMinutes)
  const soonMinutes = soon ? Math.max(1, Math.ceil(minutesUntilStart(item, now) ?? leadMinutes)) : null

  const startTimeStr = formatTime(item.startTime)
  const endTimeStr = formatTime(item.endTime)
  const timeDisplay =
    startTimeStr && endTimeStr
      ? `${startTimeStr} – ${endTimeStr}`
      : startTimeStr || ''
  const durationLabel =
    typeof item.durationMinutes === 'number' ? `${item.durationMinutes} min` : ''

  return (
    <div
      id={`agenda-item-${item.id}`}
      onClick={hasAbstract && primaryAbstract ? () => openAbstractModal(primaryAbstract) : undefined}
      className={`relative rounded-xl transition-all duration-200 border scroll-mt-28 ${
        live
          ? 'bg-brand-soft/70 border-brand ring-2 ring-brand/30 shadow-sm'
          : soon
            ? 'bg-accent-soft/80 border-accent-border ring-1 ring-accent/20'
            : isKeynote
              ? 'bg-gradient-to-r from-accent-soft/90 via-surface to-accent-soft/40 border-accent-border shadow-sm ring-1 ring-accent/20'
              : isChild
                ? 'bg-surface border-line/90'
                : 'bg-surface border-line/90 shadow-xs'
      } ${hasAbstract ? 'cursor-pointer hover:border-brand hover:shadow-md' : ''}`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            {timeDisplay && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-subtle text-fg-muted">
                <Clock className="w-3 h-3 text-fg-subtle" />
                {timeDisplay}
              </span>
            )}
            {durationLabel && (
              <span className="text-xs text-fg-subtle">({durationLabel})</span>
            )}
            {live && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wide bg-brand text-brand-fg">
                Live
              </span>
            )}
            {soon && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wide bg-accent-soft text-accent-soft-fg border border-accent-border">
                Starts in {soonMinutes} min
              </span>
            )}
            {isKeynote && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-accent-soft text-accent-soft-fg border border-accent-border">
                <Sparkles className="w-3 h-3 text-accent" />
                Keynote Lecture
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {hasAbstract && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-brand-soft text-brand-soft-fg">
                View Abstract &rarr;
              </span>
            )}
            <SaveAgendaButton item={item} />
            <div className="w-7 h-7 rounded-lg bg-brand-soft border border-brand-border flex items-center justify-center text-brand">
              <SessionIcon name={item.icon} className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="text-base sm:text-lg font-bold text-fg leading-snug">
          <RichText content={item.name} disableContainer className="rich-text-inline" />
        </div>

        {item.description && (
          <div className="mt-2 text-xs sm:text-sm text-fg-muted leading-relaxed">
            <RichText content={item.description} />
          </div>
        )}

        {linkedAbstracts.length > 0 && (
          <div className="mt-3 pt-3 border-t border-line space-y-1.5">
            {linkedAbstracts.map((abs) => (
              <button
                key={abs.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  openAbstractModal(abs)
                }}
                className="w-full flex items-center justify-between text-xs text-fg-subtle hover:text-brand-soft-fg"
              >
                <span className="font-semibold text-brand-soft-fg">
                  {abs.code || abs.plainTitle || 'Scientific Abstract'}
                </span>
                {abstractStatusLabel(abs.status) && (
                  <span className="px-2 py-0.5 rounded bg-subtle font-medium">
                    {abstractStatusLabel(abs.status)}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {hasChildren && (
          <div className="mt-4 pt-3 border-t border-line flex items-center justify-between">
            <button
              type="button"
              onClick={(e) => onToggleChildren(String(item.id), e)}
              aria-expanded={isExpanded}
              aria-label={`Toggle ${children.length} Session Items`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-subtle hover:bg-line text-fg transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <span>
                {isExpanded
                  ? `Hide Session Items (${children.length})`
                  : `Show Session Items (${children.length})`}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        )}
      </div>

      {hasChildren && isExpanded && (
        <div className="px-4 sm:px-6 pb-4 pt-2 bg-subtle/80 border-t border-line/70 rounded-b-xl space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-fg-subtle pt-1">
            Session items
          </div>
          {children.map((child) => (
            <AgendaItemCard
              key={child.id}
              item={child}
              expandedItems={expandedItems}
              onToggleChildren={onToggleChildren}
              formatTime={formatTime}
              now={now}
              isReady={isReady}
              isSaved={isSaved}
              leadMinutes={leadMinutes}
              isChild={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}
