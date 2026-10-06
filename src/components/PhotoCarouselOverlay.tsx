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
      className="fixed inset-0 z-[60] flex flex-col bg-fg/92 dark:bg-black/92 backdrop-blur-sm pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="photo-carousel-title"
      onClick={(event) => {
        event.stopPropagation()
        onClose()
      }}
    >
      <div
        className="flex items-center justify-between gap-3 px-4 py-3 text-page"
        onClick={(event) => event.stopPropagation()}
      >
        <p id="photo-carousel-title" className="text-sm font-medium">
          {safeIndex + 1} / {slides.length}
        </p>
        <div className="flex items-center gap-1">
          <CopyOverlayLink className="inline-flex size-11 items-center justify-center rounded-full text-page/80 hover:text-page hover:bg-page/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand" />
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-11 items-center justify-center rounded-full text-page/80 hover:text-page hover:bg-page/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
            aria-label="Close photo gallery"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div
        className="relative flex-1 flex items-center justify-center px-4 sm:px-12 py-2 min-h-0"
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
            className="absolute left-1 sm:left-4 inline-flex size-11 items-center justify-center rounded-full bg-page/10 text-page hover:bg-page/20 transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        ) : null}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={slide.url}
          alt={slide.alt}
          className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
        />

        {slides.length > 1 ? (
          <button
            type="button"
            onClick={() => goTo(1)}
            className="absolute right-1 sm:right-4 inline-flex size-11 items-center justify-center rounded-full bg-page/10 text-page hover:bg-page/20 transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        ) : null}
      </div>

      <div className="px-6 py-4 text-center text-page" onClick={(event) => event.stopPropagation()}>
        {slide.caption ? (
          <p className="text-sm sm:text-base italic text-page/90">{slide.caption}</p>
        ) : null}
      </div>
    </div>,
    document.body,
  )
}
