import React from 'react'
import { RichText } from './RichText'
import { Calendar, MapPin, ArrowDown, Sparkles } from 'lucide-react'
import type { Conference, ConferenceDay } from '@/payload-types'
import { formatDateRange } from '@/utilities/conferenceUi'

export interface HeroSectionProps {
  conference: Conference
  days: ConferenceDay[]
}

export function HeroSection({ conference, days }: HeroSectionProps) {
  const { name, year, city, country, description } = conference
  const dateRangeStr = formatDateRange(days)
  const locationStr = [city, country].filter(Boolean).join(', ')

  return (
    <section className="relative overflow-hidden pt-10 pb-14 sm:pt-16 sm:pb-20 bg-gradient-to-b from-emerald-50/60 via-slate-50/30 to-white">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0d5c3a_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 mb-6">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-800 text-white shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              Annual Conference {year || ''}
            </span>

            {dateRangeStr && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200/90 text-slate-700 shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                {dateRangeStr}
              </span>
            )}

            {locationStr && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200/90 text-slate-700 shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                {locationStr}
              </span>
            )}
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6">
          <RichText content={name} />
        </h1>

        {description && (
          <div className="max-w-3xl text-base sm:text-lg text-slate-600 leading-relaxed space-y-3 mb-8">
            <RichText content={description} />
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
          <a
            href="#programme"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <span>Explore Programme</span>
            <ArrowDown className="w-4 h-4" />
          </a>

          <a
            href="#venue"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 font-semibold text-sm transition-colors shadow-2xs"
          >
            <MapPin className="w-4 h-4 text-slate-500" />
            <span>Venue Info</span>
          </a>

          <a
            href="#appendix"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 font-semibold text-sm transition-colors shadow-2xs"
          >
            <span>Abstracts & Appendix</span>
          </a>
        </div>
      </div>
    </section>
  )
}
