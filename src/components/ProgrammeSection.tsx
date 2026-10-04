'use client'

import React, { useState } from 'react'
import { RichText } from './RichText'
import { SessionIcon, ChevronDown, Sparkles, Clock } from './IconRenderer'
import { useModal } from '@/context/ModalContext'
import type { Abstract, AgendaItem, ConferenceDay } from '@/payload-types'
import {
  abstractStatusLabel,
  formatDayTitle,
  joinDocs,
} from '@/utilities/conferenceUi'

export interface ProgrammeSectionProps {
  days: ConferenceDay[]
}

export function ProgrammeSection({ days }: ProgrammeSectionProps) {
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({})
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

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

  const formatTime = (dateStr?: string | null) => {
    if (!dateStr) return ''
    try {
      const d = new Date(dateStr)
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    } catch {
      return ''
    }
  }

  return (
    <section id="programme" className="scroll-mt-10 md:scroll-mt-20 py-12 sm:py-16">
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
          const rootItems = joinDocs<AgendaItem>(day.agendaItems)
          const formattedDayDate = formatDayTitle(day)

          return (
            <div
              key={day.id}
              className="border border-slate-200/90 rounded-2xl bg-white shadow-xs overflow-hidden transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => toggleDay(String(day.id))}
                aria-expanded={isDayOpen}
                aria-controls={`day-content-${day.id}`}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                      {formattedDayDate}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {formatTime(day.startTime)} – {formatTime(day.endTime)}
                    </p>
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
                        onToggleChildren={(e) => toggleItemChildren(String(item.id), e)}
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
    </section>
  )
}

function AgendaItemCard({
  item,
  isExpanded,
  onToggleChildren,
  formatTime,
  isChild = false,
}: {
  item: AgendaItem
  isExpanded: boolean
  onToggleChildren: (e: React.MouseEvent) => void
  formatTime: (d?: string | null) => string
  isChild?: boolean
}) {
  const { openAbstractModal } = useModal()
  const linkedAbstracts = joinDocs<Abstract>(item.childAbstracts)
  const children = joinDocs<AgendaItem>(item.children)
  const hasAbstract = linkedAbstracts.length > 0
  const primaryAbstract = linkedAbstracts[0]
  const hasChildren = children.length > 0
  const isKeynote = Boolean(item.isKeynote)

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
      onClick={hasAbstract && primaryAbstract ? () => openAbstractModal(primaryAbstract) : undefined}
      className={`relative rounded-xl transition-all duration-200 border ${
        isKeynote
          ? 'bg-gradient-to-r from-emerald-50/90 via-white to-emerald-50/40 border-emerald-300 shadow-sm ring-1 ring-emerald-400/20'
          : isChild
            ? 'bg-white border-slate-200/90'
            : 'bg-white border-slate-200/90 shadow-xs'
      } ${hasAbstract ? 'cursor-pointer hover:border-emerald-500 hover:shadow-md' : ''}`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            {timeDisplay && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                <Clock className="w-3 h-3 text-slate-500" />
                {timeDisplay}
              </span>
            )}
            {durationLabel && (
              <span className="text-xs text-slate-500">({durationLabel})</span>
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
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                View Abstract &rarr;
              </span>
            )}
            <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
              <SessionIcon name={item.icon} className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
          <RichText content={item.name} />
        </div>

        {item.description && (
          <div className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <RichText content={item.description} />
          </div>
        )}

        {linkedAbstracts.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
            {linkedAbstracts.map((abs) => (
              <button
                key={abs.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  openAbstractModal(abs)
                }}
                className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-emerald-800"
              >
                <span className="font-semibold text-emerald-800">
                  {abs.code || abs.plainTitle || 'Scientific Abstract'}
                </span>
                {abstractStatusLabel(abs.status) && (
                  <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">
                    {abstractStatusLabel(abs.status)}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {hasChildren && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onToggleChildren}
              aria-expanded={isExpanded}
              aria-label={`Toggle ${children.length} Session Items`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
        <div className="px-4 sm:px-6 pb-4 pt-2 bg-slate-50/80 border-t border-slate-200/70 rounded-b-xl space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 pt-1">
            Session items
          </div>
          {children.map((child) => (
            <AgendaItemCard
              key={child.id}
              item={child}
              isExpanded={false}
              onToggleChildren={() => {}}
              formatTime={formatTime}
              isChild={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}
