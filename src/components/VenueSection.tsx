import React from 'react'
import { RichText } from './RichText'
import { MapPin, ExternalLink } from './IconRenderer'
import type { Conference } from '@/payload-types'

export interface VenueSectionProps {
  conference: Conference
}

export function VenueSection({ conference }: VenueSectionProps) {
  const { address, city, country, latitude, longitude, location } = conference

  const hasAddress = address || city || country
  const hasCoords = typeof latitude === 'number' && typeof longitude === 'number'

  const mapUrl = hasCoords
    ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    : hasAddress
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          [address, city, country].filter(Boolean).join(', '),
        )}`
      : null

  return (
    <section
      id="venue"
      className="scroll-mt-10 md:scroll-mt-20 py-12 sm:py-16 border-t border-slate-200"
    >
      <div className="mb-8 pb-4 border-b border-slate-200">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          Location & Logistics
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Conference Venue
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 rounded-2xl bg-white border border-slate-200/90 p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Address & City</h3>
              <p className="text-xs text-slate-500">Official conference hall</p>
            </div>
          </div>

          <div className="text-sm text-slate-700 space-y-1 pl-1 border-l-2 border-emerald-500">
            {address && <p className="font-medium text-slate-900">{address}</p>}
            {(city || country) && (
              <p className="text-slate-600">{[city, country].filter(Boolean).join(', ')}</p>
            )}
          </div>

          {hasCoords && (
            <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200/60 font-mono">
              GPS: {latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E
            </div>
          )}

          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Open location in Google Maps (opens in new tab)"
            >
              <span>Get Directions in Maps</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            Directions, Transport & Delegate Services
          </h3>
          {location ? (
            <div className="text-sm text-slate-700 leading-relaxed space-y-3">
              <RichText content={location} />
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">
              Venue transportation guidelines and local hotel agreements will be announced soon.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
