'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { RichText } from '@/components/RichText'
import type { IntroAccordionBlock } from '@/payload-types'
import { cn } from '@/utilities/ui'

type AccordionItem = NonNullable<IntroAccordionBlock['items']>[number]

function hasItem(item: AccordionItem): boolean {
  return Boolean(item.title?.trim())
}

export function IntroAccordion({
  block,
  compact = false,
}: {
  block: IntroAccordionBlock
  compact?: boolean
}) {
  const items = block.items?.filter(hasItem)
  if (!items?.length) return null

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => (
        <AccordionRow
          key={item.id ?? `${item.title}-${index}`}
          item={item}
          compact={compact}
        />
      ))}
    </div>
  )
}

function AccordionRow({
  item,
  compact,
}: {
  item: AccordionItem
  compact?: boolean
}) {
  const [open, setOpen] = useState(Boolean(item.defaultOpen))

  return (
    <details
      className="group rounded-2xl border border-line/90 bg-surface shadow-xs overflow-hidden"
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary
        className={cn(
          'flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4',
          'text-left text-base font-semibold text-fg',
          'hover:bg-subtle/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50',
          '[&::-webkit-details-marker]:hidden',
        )}
      >
        <span className={compact ? 'text-sm sm:text-base' : undefined}>{item.title}</span>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-subtle text-fg-muted transition-transform duration-200 group-open:rotate-180 group-open:bg-brand-soft group-open:text-brand-soft-fg">
          <ChevronDown className="size-5" aria-hidden />
        </span>
      </summary>
      <div
        className={cn(
          'border-t border-line bg-subtle/40 px-5 py-4 leading-relaxed',
          compact ? 'text-sm text-fg-muted' : 'text-base text-fg-muted',
        )}
      >
        {item.content ? <RichText content={item.content} /> : null}
      </div>
    </details>
  )
}
