import React from 'react'
import { AlertTriangle, ArrowRight, Info, Sparkles } from 'lucide-react'
import { RichText } from '@/components/RichText'
import type {
  IntroCalloutBlock,
  IntroCtaBlock,
  IntroQuoteBlock,
  IntroSeparatorBlock,
} from '@/payload-types'
import { cn } from '@/utilities/ui'

const SECTION_HREFS = {
  programme: '#programme',
  venue: '#venue',
  appendix: '#appendix',
} as const

const CALLOUT_STYLES = {
  note: {
    box: 'border-line bg-subtle text-fg-muted',
    icon: 'text-brand',
    Icon: Info,
  },
  important: {
    box: 'border-brand-border bg-brand-soft text-brand-soft-fg',
    icon: 'text-brand',
    Icon: Sparkles,
  },
  deadline: {
    box: 'border-accent-border bg-accent-soft text-accent-soft-fg',
    icon: 'text-accent',
    Icon: AlertTriangle,
  },
} as const

function isSafeHref(url: string): boolean {
  return !/^(javascript|data|vbscript):/i.test(url.trim())
}

export function introCtaHref(block: IntroCtaBlock): string | null {
  if (block.destination === 'custom') {
    const url = block.url?.trim()
    if (!url || !isSafeHref(url)) return null
    return url
  }
  if (block.destination && block.destination in SECTION_HREFS) {
    return SECTION_HREFS[block.destination]
  }
  return null
}

export function IntroCallout({ block }: { block: IntroCalloutBlock }) {
  const tone = block.tone && block.tone in CALLOUT_STYLES ? block.tone : 'note'
  const { box, icon, Icon } = CALLOUT_STYLES[tone]
  const title = block.title?.trim()

  return (
    <aside className={cn('flex gap-3 rounded-2xl border px-5 py-4 shadow-xs', box)}>
      <Icon className={cn('mt-0.5 size-5 shrink-0', icon)} aria-hidden />
      <div className="min-w-0 text-sm sm:text-base leading-relaxed">
        {title ? <p className="font-semibold text-current mb-1">{title}</p> : null}
        {block.body ? <RichText content={block.body} /> : null}
      </div>
    </aside>
  )
}

export function IntroCta({ block }: { block: IntroCtaBlock }) {
  const href = introCtaHref(block)
  const label = block.label?.trim()
  if (!href || !label) return null

  const solid = block.appearance !== 'outline'

  return (
    <a
      href={href}
      target={block.destination === 'custom' && block.newTab ? '_blank' : undefined}
      rel={block.destination === 'custom' && block.newTab ? 'noopener noreferrer' : undefined}
      className={cn(
        'inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand',
        solid
          ? 'bg-brand text-brand-fg shadow-sm hover:bg-brand-hover'
          : 'border border-line/90 bg-surface text-fg-muted shadow-2xs hover:bg-subtle',
      )}
    >
      <span>{label}</span>
      <ArrowRight className="size-4" aria-hidden />
    </a>
  )
}

export function IntroQuote({ block }: { block: IntroQuoteBlock }) {
  const quote = block.quote?.trim()
  if (!quote) return null
  const attribution = block.attribution?.trim()

  return (
    <figure className="border-l-4 border-brand pl-5 py-1">
      <blockquote className="text-lg sm:text-xl font-medium italic text-fg leading-relaxed whitespace-pre-wrap">
        {quote}
      </blockquote>
      {attribution ? (
        <figcaption className="mt-3 text-sm font-semibold text-fg-subtle not-italic">
          {attribution}
        </figcaption>
      ) : null}
    </figure>
  )
}

export function IntroSeparator({ block }: { block: IntroSeparatorBlock }) {
  if (block.style === 'space') {
    return <div className="h-4 sm:h-6" aria-hidden />
  }

  return <hr className="border-0 border-t border-line" />
}
