import React from 'react'
import { IntroAccordion } from '@/components/IntroAccordion'
import {
  IntroCallout,
  IntroCta,
  IntroQuote,
  IntroSeparator,
  introCtaHref,
} from '@/components/IntroLayoutBlocks'
import { RichText } from '@/components/RichText'
import type { IntroColumnSize } from '@/fields/columnSize'
import type { Conference } from '@/payload-types'
import { cn } from '@/utilities/ui'

export type LayoutBlock = NonNullable<Conference['intro']>[number]

/** Full class strings live here so Tailwind's content scanner emits them. */
const COLUMN_SPAN_CLASS: Record<IntroColumnSize, string> = {
  full: 'col-span-4 lg:col-span-12',
  twoThirds: 'col-span-4 lg:col-span-8',
  half: 'col-span-4 lg:col-span-6',
  oneThird: 'col-span-4 lg:col-span-4',
}

function columnSpan(size: string | null | undefined): string {
  if (size && size in COLUMN_SPAN_CLASS) {
    return COLUMN_SPAN_CLASS[size as IntroColumnSize]
  }
  return COLUMN_SPAN_CLASS.full
}

function hasLexicalContent(content: { root?: { children?: unknown[] } } | null | undefined): boolean {
  const children = content?.root?.children
  return Array.isArray(children) && children.length > 0
}

function isVisibleBlock(block: LayoutBlock): boolean {
  switch (block.blockType) {
    case 'content':
      return Boolean(block.columns?.some((column) => hasLexicalContent(column.content)))
    case 'accordion':
      return Boolean(block.items?.some((item) => item.title?.trim()))
    case 'callout':
      return Boolean(block.title?.trim() || hasLexicalContent(block.body))
    case 'cta':
      return Boolean(block.label?.trim() && introCtaHref(block))
    case 'quote':
      return Boolean(block.quote?.trim())
    case 'separator':
      return true
    default:
      return false
  }
}

function LayoutBlockBody({
  block,
  compact,
}: {
  block: LayoutBlock
  compact?: boolean
}) {
  switch (block.blockType) {
    case 'content':
      return (
        <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-6 lg:gap-x-10 items-start">
          {block.columns?.map((column, index) => {
            if (!hasLexicalContent(column.content)) return null
            return (
              <div
                key={column.id ?? `column-${index}`}
                className={cn(columnSpan(column.size), 'min-w-0')}
              >
                <RichText
                  content={column.content}
                  className={cn(
                    compact ? 'text-sm sm:text-base' : 'text-base sm:text-lg',
                    '[&_figure]:w-full [&_img]:w-full [&_img]:max-h-none',
                  )}
                />
              </div>
            )
          })}
        </div>
      )
    case 'accordion':
      return <IntroAccordion block={block} compact={compact} />
    case 'callout':
      return <IntroCallout block={block} />
    case 'cta':
      return <IntroCta block={block} />
    case 'quote':
      return <IntroQuote block={block} />
    case 'separator':
      return <IntroSeparator block={block} />
    default:
      return null
  }
}

export function hasVisibleLayoutBlocks(blocks: LayoutBlock[] | null | undefined): boolean {
  return Boolean(blocks?.some(isVisibleBlock))
}

export function LayoutBlocks({
  blocks,
  compact = false,
}: {
  blocks: LayoutBlock[] | null | undefined
  compact?: boolean
}) {
  const visible = blocks?.filter(isVisibleBlock)
  if (!visible?.length) return null

  return (
    <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-6 lg:gap-x-10 items-start">
      {visible.map((block, index) => (
        <div
          key={block.id ?? `${block.blockType}-${index}`}
          className={cn(
            block.blockType === 'content'
              ? COLUMN_SPAN_CLASS.full
              : columnSpan('size' in block ? block.size : undefined),
            'min-w-0',
          )}
        >
          <LayoutBlockBody block={block} compact={compact} />
        </div>
      ))}
    </div>
  )
}
