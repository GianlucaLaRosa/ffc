import React from 'react'
import { RichText } from './RichText'
import { Calendar, MapPin } from 'lucide-react'
import type { Conference, ConferenceDay } from '@/payload-types'
import { formatDateRange } from '@/utilities/conferenceUi'

export interface HeroSectionProps {
  conference: Conference
  days: ConferenceDay[]
}

export function HeroSection({ conference, days }: HeroSectionProps) {
  const { name, city, country } = conference
  const dateRangeStr = formatDateRange(days)
  const locationStr = [city, country].filter(Boolean).join(', ')

  return (
    <section className="relative overflow-hidden pt-10 pb-8 sm:pt-16 sm:pb-10 bg-gradient-to-b from-brand-soft/75 via-page to-surface">
      <div className="absolute inset-0 opacity-[0.12] dark:opacity-[0.08] pointer-events-none bg-[radial-gradient(rgb(var(--brand))_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        {dateRangeStr || locationStr ? (
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-6">
            {dateRangeStr ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-page/80 backdrop-blur-sm border border-line/90 text-fg-muted shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-brand" />
                {dateRangeStr}
              </span>
            ) : null}

            {locationStr ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-page/80 backdrop-blur-sm border border-line/90 text-fg-muted shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-brand" />
                {locationStr}
              </span>
            ) : null}
          </div>
        ) : null}

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-fg tracking-tight leading-[1.15]">
          <RichText content={name} disableContainer className="rich-text-inline" />
        </h1>
      </div>
    </section>
  )
}
