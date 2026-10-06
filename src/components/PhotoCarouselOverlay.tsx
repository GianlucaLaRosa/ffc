'use client'

import React, { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X } from './IconRenderer'
import { CopyOverlayLink } from './CopyOverlayLink'
import type { AbstractGallerySlide } from '@/utilities/conferenceUi'

type PhotoCarouselOverlayProps = {
  slides: AbstractGallerySlide[]
  index: number
  onIndexChange: (index: number) => void
  onClose: () => void
}

export function PhotoCarouselOverlay({
  slides,
  index,
  onIndexChange,
  onClose,
}: PhotoCarouselOverlayProps) {
  const lastIndex = Math.max(slides.length - 1, 0)
  const safeIndex = Math.min(Math.max(index, 0), lastIndex)
  const touchStartX = useRef<number | null>(null)

  const goTo = useCallback(
    (delta: number) => {
      if (slides.length === 0) return
      onIndexChange((safeIndex + delta + slides.length) % slides.length)
    },
    [onIndexChange, safeIndex, slides.length],
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        onClose()
        return
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goTo(-1)
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        goTo(1)
      }
    }

    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [goTo, onClose])

  if (slides.length === 0) return null

  const slide = slides[safeIndex]
  if (!slide) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-black/90 text-white pt-[env(safe-area-inset-top)]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="photo-carousel-title"
      onClick={(event) => {
        event.stopPropagation()
        onClose()
      }}
    >
      <div
        className="flex items-center justify-between gap-3 px-4 py-3 shrink-0"
        onClick={(event) => event.stopPropagation()}
      >
        <p id="photo-carousel-title" className="text-sm font-medium text-white">
          {safeIndex + 1} / {slides.length}
        </p>
        <div className="flex items-center gap-1">
          <CopyOverlayLink className="text-white/80 hover:text-white hover:bg-white/10" />
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-11 items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
            aria-label="Close photo gallery"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div
        className="relative flex-1 min-h-0 overflow-hidden"
        onClick={(event) => event.stopPropagation()}
        onTouchStart={(event) => {
          touchStartX.current = event.changedTouches[0]?.clientX ?? null
        }}
        onTouchEnd={(event) => {
          const start = touchStartX.current
          const end = event.changedTouches[0]?.clientX
          touchStartX.current = null
          if (start == null || end == null) return
          const delta = end - start
          if (Math.abs(delta) < 40) return
          goTo(delta > 0 ? -1 : 1)
        }}
      >
        {slides.length > 1 ? (
          <button
            type="button"
            onClick={() => goTo(-1)}
            className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-10 inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        ) : null}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={slide.url}
          alt={slide.alt}
          className="absolute inset-0 m-auto max-h-full max-w-full object-contain p-4 sm:px-14"
        />

        {slides.length > 1 ? (
          <button
            type="button"
            onClick={() => goTo(1)}
            className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-10 inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        ) : null}
      </div>

      <div
        className="px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-center shrink-0"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-sm sm:text-base text-white min-h-[1.5em]">{slide.caption}</p>
      </div>
    </div>,
    document.body,
  )
}
