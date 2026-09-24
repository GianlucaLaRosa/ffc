'use client'

import React, { useState } from 'react'
import { RichText } from './RichText'
import { SessionIcon, ChevronDown, ChevronRight, Sparkles, Clock } from './IconRenderer'
import { AbstractModal } from './AbstractModal'

export interface ProgrammeSectionProps {
  days: any[]
  agendaItems: any[]
}

export function ProgrammeSection({ days, agendaItems }: ProgrammeSectionProps) {
  // Collapsed state for days: initially all days are collapsed as requested!
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({})

  // Collapsed state for agenda-items that have children: initially collapsed!
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  // Selected abstract for full-screen modal
  const [selectedAbstract, setSelectedAbstract] = useState<any | null>(null)

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

  const handleItemClick = (item: any) => {
    if (item.abstract) {
      setSelectedAbstract(item.abstract)
    }
  }

  // Format time helper
  const formatTime = (dateStr?: string) => {
    if (!dateStr) return ''
    try {
      const d = new Date(dateStr)
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    } catch {
      return ''
    }
  }

  return (
    <section id="programme" className="scroll-mt-20 py-12 sm:py-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-200 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Scientific Schedule
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Conference Programme
          </h2>
        </div>
      </div>

      <div className="space-y-4">
        {days.map((day) => {
          const isDayOpen = Boolean(expandedDays[day.id])
          // Filter root agenda items for this day (items where day matches and is not child of another)
          const dayItems = agendaItems.filter((item) => {
            const itemDayId = typeof item.day === 'object' ? item.day?.id : item.day
            return String(itemDayId) === String(day.id)
          })

          // Identify child IDs so we only render root items at the top level
          const childIds = new Set<string>()
          for (const item of dayItems) {
            if (Array.isArray(item.children)) {
              for (const child of item.children) {
                const cId = typeof child === 'object' ? child.id : child
                if (cId) childIds.add(String(cId))
              }
            }
          }
          const rootItems = dayItems.filter((item) => !childIds.has(String(item.id)))

          const formattedDayDate = day.date
            ? new Date(day.date).toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            : ''

          return (
            <div
              key={day.id}
              className="border border-slate-200/90 rounded-2xl bg-white shadow-xs overflow-hidden transition-all duration-200"
            >
              {/* Day Collapsible Header */}
              <button
                type="button"
                onClick={() => toggleDay(day.id)}
                aria-expanded={isDayOpen}
                aria-controls={`day-content-${day.id}`}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-800 font-bold text-sm shrink-0">
                    {day.order || '#'}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                      {day.title}
                    </h3>
                    {formattedDayDate && (
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {formattedDayDate}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-medium hidden sm:inline-block">
                    {rootItems.length} {rootItems.length === 1 ? 'session' : 'sessions'}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 text-slate-600 transition-transform duration-200 ${
                      isDayOpen ? 'rotate-180 bg-emerald-100 text-emerald-800' : ''
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </div>
              </button>

              {/* Day Collapsible Content */}
              {isDayOpen && (
                <div
                  id={`day-content-${day.id}`}
                  className="px-4 sm:px-6 pb-6 pt-2 border-t border-slate-100 space-y-3 bg-slate-50/40"
                >
                  {rootItems.length === 0 ? (
                    <p className="text-sm text-slate-500 py-6 text-center italic">
                      No agenda items scheduled for this day yet.
                    </p>
                  ) : (
                    rootItems.map((item) => (
                      <AgendaItemCard
                        key={item.id}
                        item={item}
                        isExpanded={Boolean(expandedItems[item.id])}
                        onToggleChildren={(e) => toggleItemChildren(item.id, e)}
                        onItemClick={() => handleItemClick(item)}
                        formatTime={formatTime}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Full-Screen Abstract Modal */}
      <AbstractModal
        abstract={selectedAbstract}
        isOpen={Boolean(selectedAbstract)}
        onClose={() => setSelectedAbstract(null)}
      />
    </section>
  )
}

function AgendaItemCard({
  item,
  isExpanded,
  onToggleChildren,
  onItemClick,
  formatTime,
  isChild = false,
}: {
  item: any
  isExpanded: boolean
  onToggleChildren: (e: React.MouseEvent) => void
  onItemClick: () => void
  formatTime: (d?: string) => string
  isChild?: boolean
}) {
  const hasAbstract = Boolean(item.abstract)
  const hasChildren = Array.isArray(item.children) && item.children.length > 0
  const isKeynote = Boolean(item.isKeynote)

  const startTimeStr = formatTime(item.startTime)
  const endTimeStr = formatTime(item.endTime)
  const timeDisplay =
    startTimeStr && endTimeStr
      ? `${startTimeStr} – ${endTimeStr}`
      : startTimeStr || item.duration || ''

  return (
    <div
      onClick={hasAbstract ? onItemClick : undefined}
      className={`relative rounded-xl transition-all duration-200 border ${
        isKeynote
          ? 'bg-gradient-to-r from-emerald-50/90 via-white to-emerald-50/40 border-emerald-300 shadow-sm ring-1 ring-emerald-400/20'
          : isChild
          ? 'bg-white border-slate-200/90'
          : 'bg-white border-slate-200/90 shadow-xs'
      } ${hasAbstract ? 'cursor-pointer hover:border-emerald-500 hover:shadow-md' : ''}`}
    >
      <div className="p-4 sm:p-5">
        {/* Top bar: Time, Keynote flag, Lucide icon */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            {timeDisplay && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                <Clock className="w-3 h-3 text-slate-500" />
                {timeDisplay}
              </span>
            )}
            {item.duration && !timeDisplay.includes(item.duration) && (
              <span className="text-xs text-slate-500">({item.duration})</span>
            )}
            {isKeynote && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Keynote Lecture
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {hasAbstract && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 group-hover:bg-emerald-200 transition-colors">
                View Abstract &rarr;
              </span>
            )}
            <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
              <SessionIcon name={item.icon} className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
          <RichText content={item.title} />
        </div>

        {/* Description / Notes */}
        {item.description && (
          <div className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <RichText content={item.description} />
          </div>
        )}

        {/* Linked Abstract snippet */}
        {hasAbstract && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-emerald-800">
                Code: {item.abstract.code || 'Scientific Abstract'}
              </span>
              {item.abstract.status?.name && (
                <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">
                  {item.abstract.status.name}
                </span>
              )}
            </div>
            <span className="text-emerald-700 font-medium hover:underline">
              Read Abstract Details &rarr;
            </span>
          </div>
        )}

        {/* Children toggle button if this item has sub-sessions */}
        {hasChildren && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onToggleChildren}
              aria-expanded={isExpanded}
              aria-label={`Toggle ${item.children.length} sub-sessions`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <span>{isExpanded ? 'Hide Sub-sessions' : `Show Sub-sessions (${item.children.length})`}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
            <span className="text-xs text-slate-500 italic">Parallel tracks / Sub-talks</span>
          </div>
        )}
      </div>

      {/* Sub-sessions / Children cards (collapsed by default) */}
      {hasChildren && isExpanded && (
        <div className="px-4 sm:px-6 pb-4 pt-2 bg-slate-50/80 border-t border-slate-200/70 rounded-b-xl space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 pt-1">
            Sub-sessions & Parallel Communications
          </div>
          {item.children.map((child: any) => (
            <AgendaItemCard
              key={child.id}
              item={child}
              isExpanded={false}
              onToggleChildren={() => {}}
              onItemClick={() => {
                if (child.abstract) {
                  onItemClick()
                }
              }}
              formatTime={formatTime}
              isChild={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}
