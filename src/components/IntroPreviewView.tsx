import React from 'react'

import { ConferenceTheme } from '@/components/ConferenceTheme'
import { IntroSection } from '@/components/IntroSection'
import { hasVisibleLayoutBlocks } from '@/components/LayoutBlocks'
import { RichText } from '@/components/RichText'
import { ThemeToggle } from '@/components/ThemeToggle'
import type { Conference } from '@/payload-types'
import { formatHeaderEyebrow, mediaUrl } from '@/utilities/conferenceUi'

export function IntroPreviewView({ conference }: { conference: Conference }) {
  const logoSrc = mediaUrl(conference.logo) || '/logo.png'

  return (
    <ConferenceTheme
      className="min-h-screen flex flex-col bg-page"
      primaryColor={conference.primaryColor}
      secondaryColor={conference.secondaryColor}
    >
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-line/80 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3 p-1 min-w-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoSrc}
                alt=""
                className="h-10 sm:h-11 w-auto object-contain rounded"
              />
              <div className="leading-tight min-w-0">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-soft-fg block truncate">
                  {formatHeaderEyebrow({ headerEyebrow: conference.headerEyebrow })}
                </span>
                <div className="text-sm sm:text-base font-extrabold text-fg truncate">
                  <RichText
                    content={conference.name}
                    disableContainer
                    className="rich-text-inline header-edition-title"
                  />
                </div>
              </div>
            </div>
            <ThemeToggle className="inline-flex" />
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {hasVisibleLayoutBlocks(conference.intro) ? (
          <IntroSection conference={conference} />
        ) : (
          <section className="pt-8 sm:pt-12 pb-12 sm:pb-16" aria-label="Conference introduction">
            <p className="text-sm text-fg-muted">
              Add intro blocks to preview the conference introduction here.
            </p>
          </section>
        )}
      </main>
    </ConferenceTheme>
  )
}
