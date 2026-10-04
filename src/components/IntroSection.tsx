import React from 'react'
import { hasVisibleLayoutBlocks, LayoutBlocks } from '@/components/LayoutBlocks'
import type { Conference } from '@/payload-types'

export function IntroSection({ conference }: { conference: Conference }) {
  if (!hasVisibleLayoutBlocks(conference.intro)) return null

  return (
    <section className="pt-2 sm:pt-4 pb-12 sm:pb-16" aria-label="Conference introduction">
      <LayoutBlocks blocks={conference.intro} />
    </section>
  )
}
