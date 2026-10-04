'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X } from './IconRenderer'
import type { AbstractGallerySlide } from '@/utilities/conferenceUi'

type PhotoCarouselOverlayProps = {
  slides: AbstractGallerySlide[]
  startIndex?: number
  onClose: () => void
}

export function PhotoCarouselOverlay({
  slides,
  startIndex = 0,
  onClose,
}: PhotoCarouselOverlayProps) {
  const lastIndex = Math.max(slides.length - 1, 0)
  const [index, setIndex] = useState(() => Math.min(Math.max(startIndex, 0), lastIndex))
  const touchStartX = useRef<number | null>(null)

  const goTo = useCallback(
    (delta: number) => {
      if (slides.length === 0) return
      setIndex((current) => (current + delta + slides.length) % slides.length)
    },
    [slides.length],
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

  const slide = slides[index]
  if (!slide) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-fg/92 backdrop-blur-sm"
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
          {index + 1} / {slides.length}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full text-page/80 hover:text-page hover:bg-page/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
          aria-label="Close photo gallery"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div
        className="relative flex-1 flex items-center justify-center px-12 py-2 min-h-0"
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
            className="absolute left-2 sm:left-4 p-2 rounded-full bg-page/10 text-page hover:bg-page/20 transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
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
            className="absolute right-2 sm:right-4 p-2 rounded-full bg-page/10 text-page hover:bg-page/20 transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
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
