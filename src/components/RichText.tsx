import React from 'react'
import { defaultColors } from '@payloadcms/richtext-lexical'
import type { SerializedBlockNode, SerializedLinkNode } from '@payloadcms/richtext-lexical'
import {
  LinkJSXConverter,
  RichText as PayloadRichText,
  type JSXConverterArgs,
  type JSXConvertersFunction,
} from '@payloadcms/richtext-lexical/react'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Media, MediaBlock } from '@/payload-types'
import { conferencePublicPath } from '@/utilities/conferenceRoutes'
import { mediaUrl } from '@/utilities/conferenceUi'
import { cn } from '@/utilities/ui'

type TextStateCss = Record<string, string | undefined>

const TEXT_STATE_STYLES: Record<string, TextStateCss> = {}
for (const group of [defaultColors.text, defaultColors.background]) {
  for (const [key, def] of Object.entries(group)) {
    TEXT_STATE_STYLES[key] = def.css
  }
}

function cssToReact(css: TextStateCss): React.CSSProperties {
  const style: Record<string, string> = {}
  for (const [property, value] of Object.entries(css)) {
    if (!value) continue
    const camel = property.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())
    style[camel] = value
  }
  return style
}

function applyTextState(node: { $?: Record<string, string> }, children: React.ReactNode) {
  const state = node.$
  if (!state) return children

  const style: React.CSSProperties = {}
  for (const value of Object.values(state)) {
    const css = TEXT_STATE_STYLES[value]
    if (css) Object.assign(style, cssToReact(css))
  }

  if (Object.keys(style).length === 0) return children
  return <span style={style}>{children}</span>
}

function internalDocToHref({ linkNode }: { linkNode: SerializedLinkNode }): string {
  const value = linkNode.fields.doc?.value
  if (!value || typeof value !== 'object') return '#'

  const slug = 'slug' in value && typeof value.slug === 'string' ? value.slug : null
  const publicArchive = 'publicArchive' in value ? Boolean(value.publicArchive) : false
  return conferencePublicPath({ slug, publicArchive }) ?? (slug ? '/' : '#')
}

function MediaBlockFigure({ fields }: { fields: MediaBlock }) {
  const url = mediaUrl(fields.media)
  if (!url) return null
  const media = typeof fields.media === 'object' ? fields.media : null
  const alt = media?.alt?.trim() || 'Image'

  return (
    <figure className="my-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={alt}
        className="rounded-lg border border-line shadow max-h-96 w-auto object-contain"
      />
      {media?.caption ? (
        <figcaption className="text-xs text-fg-subtle mt-1.5 italic">
          <RichText content={media.caption} disableContainer />
        </figcaption>
      ) : null}
    </figure>
  )
}

function UploadFigure({
  value,
  extraAlt,
  extraCaption,
}: {
  value: Media
  extraAlt?: string | null
  extraCaption?: Media['caption']
}) {
  const url = mediaUrl(value)
  if (!url) return null
  const alt = extraAlt?.trim() || value.alt?.trim() || 'Image'
  const caption = extraCaption ?? value.caption

  return (
    <figure className="my-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={alt}
        className="rounded-lg border border-line shadow max-h-96 w-auto object-contain"
      />
      {caption ? (
        <figcaption className="text-xs text-fg-subtle mt-1.5 italic">
          <RichText content={caption} disableContainer />
        </figcaption>
      ) : null}
    </figure>
  )
}

type LexicalRichTextNode = {
  type?: string
  children?: LexicalRichTextNode[]
  checked?: boolean
  value?: number
}

type RichTextNodes = NonNullable<Parameters<JSXConverterArgs['nodesToJSX']>[0]['nodes']>

function inlineChildren(args: Pick<JSXConverterArgs, 'node' | 'nodesToJSX'>) {
  const node = args.node as LexicalRichTextNode
  return args.nodesToJSX({ nodes: (node.children ?? []) as RichTextNodes })
}

/** Payload's checklist converter uses uuid() which mismatches SSR vs client. */
function listItemConverter(args: JSXConverterArgs) {
  const { childIndex, nodesToJSX, parent } = args
  const node = args.node as LexicalRichTextNode
  const children = node.children ?? []
  const hasSubLists = children.some((child: LexicalRichTextNode) => child.type === 'list')
  const content = nodesToJSX({ nodes: children as RichTextNodes })

  if (parent && 'listType' in parent && parent.listType === 'check') {
    const checkboxId = `rt-check-${childIndex}-${String(node.value ?? 'item')}`
    return (
      <li
        aria-checked={node.checked ? 'true' : 'false'}
        className={`list-item-checkbox${node.checked ? ' list-item-checkbox-checked' : ' list-item-checkbox-unchecked'}${hasSubLists ? ' nestedListItem' : ''}`}
        role="checkbox"
        style={{ listStyleType: 'none' }}
        tabIndex={-1}
        value={node.value}
      >
        {hasSubLists ? (
          content
        ) : (
          <>
            <input checked={Boolean(node.checked)} id={checkboxId} readOnly type="checkbox" />
            <label htmlFor={checkboxId}>{content}</label>
            <br />
          </>
        )}
      </li>
    )
  }

  return (
    <li
      className={hasSubLists ? 'nestedListItem' : ''}
      style={hasSubLists ? { listStyleType: 'none' } : undefined}
      value={node.value}
    >
      {content}
    </li>
  )
}

function createConverters(inline: boolean): JSXConvertersFunction {
  return ({ defaultConverters }) => ({
    ...defaultConverters,
    ...LinkJSXConverter({ internalDocToHref }),
    heading: (args) => {
      if (inline) {
        const children = inlineChildren(args)
        if (!children?.length) return null
        return <span>{children}</span>
      }
      const tag = args.node.tag
      const safeTag = tag === 'h3' || tag === 'h4' || tag === 'h5' || tag === 'h6' ? tag : 'h3'
      const node = { ...args.node, tag: safeTag }
      if (typeof defaultConverters.heading === 'function') {
        return defaultConverters.heading({ ...args, node })
      }
      return null
    },
    paragraph: (args) => {
      if (inline) {
        const children = inlineChildren(args)
        if (!children?.length) return null
        return <span>{children}</span>
      }
      if (typeof defaultConverters.paragraph === 'function') {
        return defaultConverters.paragraph(args)
      }
      return null
    },
    quote: (args) => {
      if (inline) {
        const children = inlineChildren(args)
        if (!children?.length) return null
        return <span>{children}</span>
      }
      if (typeof defaultConverters.quote === 'function') {
        return defaultConverters.quote(args)
      }
      return null
    },
    list: (args) => {
      if (inline) {
        const children = inlineChildren(args)
        if (!children?.length) return null
        return <span>{children}</span>
      }
      if (typeof defaultConverters.list === 'function') {
        return defaultConverters.list(args)
      }
      return null
    },
    listitem: (args) => {
      if (inline) {
        const children = inlineChildren(args)
        if (!children?.length) return null
        return <span>{children} </span>
      }
      return listItemConverter(args)
    },
    horizontalRule: inline ? () => null : defaultConverters.horizontalRule,
    text: (args) => {
      const converted =
        typeof defaultConverters.text === 'function' ? defaultConverters.text(args) : args.node.text
      return applyTextState(args.node as { $?: Record<string, string> }, converted)
    },
    upload: ({ node }) => {
      if (inline) return null
      if (typeof node.value !== 'object' || node.value == null) return null
      return (
        <UploadFigure
          value={node.value as Media}
          extraAlt={typeof node.fields?.alt === 'string' ? node.fields.alt : null}
          extraCaption={node.fields?.caption as Media['caption']}
        />
      )
    },
    blocks: {
      mediaBlock: ({ node }: { node: SerializedBlockNode<MediaBlock> }) =>
        inline ? null : <MediaBlockFigure fields={node.fields} />,
    },
  })
}

const jsxConverters = createConverters(false)
const inlineJsxConverters = createConverters(true)

export interface RichTextProps {
  content: unknown
  className?: string
  disableContainer?: boolean
}

export function RichText({ content, className = '', disableContainer = false }: RichTextProps) {
  if (!content) return null
  if (typeof content === 'string') {
    return <span className={className}>{content}</span>
  }
  if (typeof content !== 'object' || !('root' in content)) return null

  const inline = className.includes('rich-text-inline')
  const skipContainer = disableContainer || inline

  const rendered = (
    <PayloadRichText
      data={content as DefaultTypedEditorState}
      converters={inline ? inlineJsxConverters : jsxConverters}
      disableContainer={skipContainer}
      className={skipContainer ? undefined : cn('rich-text', className)}
    />
  )

  if (inline) {
    return <span className={className}>{rendered}</span>
  }

  return rendered
}
