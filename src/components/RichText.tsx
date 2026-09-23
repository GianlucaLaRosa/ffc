import React from 'react'

export interface RichTextProps {
  content: any
  className?: string
}

export function RichText({ content, className = '' }: RichTextProps) {
  if (!content || !content.root || !Array.isArray(content.root.children)) {
    if (typeof content === 'string') {
      return <span className={className}>{content}</span>
    }
    return null
  }

  return (
    <div className={`rich-text ${className}`}>
      {content.root.children.map((node: any, idx: number) => (
        <RenderLexicalNode key={idx} node={node} />
      ))}
    </div>
  )
}

function RenderLexicalNode({ node }: { node: any }): React.ReactNode {
  if (!node) return null

  // Text node
  if (node.type === 'text') {
    let el: React.ReactNode = node.text || ''
    const format = node.format || 0

    if (format & 1) el = <strong>{el}</strong>
    if (format & 2) el = <em>{el}</em>
    if (format & 4) el = <s>{el}</s>
    if (format & 8) el = <u>{el}</u>
    if (format & 16) el = <code>{el}</code>
    if (format & 32) el = <sub>{el}</sub>
    if (format & 64) el = <sup>{el}</sup>

    return el
  }

  // Link node
  if (node.type === 'link') {
    const url = node.fields?.url || node.url || '#'
    const newTab = node.fields?.newTab || false
    return (
      <a
        href={url}
        target={newTab ? '_blank' : undefined}
        rel={newTab ? 'noopener noreferrer' : undefined}
        className="text-emerald-700 underline hover:text-emerald-900 transition-colors"
      >
        {node.children?.map((child: any, i: number) => (
          <RenderLexicalNode key={i} node={child} />
        ))}
      </a>
    )
  }

  // Paragraph node
  if (node.type === 'paragraph') {
    if (!node.children || node.children.length === 0) {
      return <p className="min-h-[1em]" />
    }
    return (
      <p className="mb-3 leading-relaxed last:mb-0">
        {node.children.map((child: any, i: number) => (
          <RenderLexicalNode key={i} node={child} />
        ))}
      </p>
    )
  }

  // Heading node
  if (node.type === 'heading') {
    const Tag = (node.tag || 'h2') as keyof React.JSX.IntrinsicElements
    const headingStyles: Record<string, string> = {
      h1: 'text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-4 mt-6',
      h2: 'text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-3 mt-5',
      h3: 'text-lg sm:text-xl font-semibold text-slate-900 mb-2 mt-4',
      h4: 'text-base font-semibold text-slate-900 mb-2 mt-3',
    }
    const cls = headingStyles[node.tag] || 'font-bold mb-2 mt-3'
    return (
      <Tag className={cls}>
        {node.children?.map((child: any, i: number) => (
          <RenderLexicalNode key={i} node={child} />
        ))}
      </Tag>
    )
  }

  // List node
  if (node.type === 'list') {
    const isOrdered = node.listType === 'number'
    const ListTag = isOrdered ? 'ol' : 'ul'
    const listCls = isOrdered
      ? 'list-decimal pl-6 mb-3 space-y-1'
      : 'list-disc pl-6 mb-3 space-y-1'
    return (
      <ListTag className={listCls}>
        {node.children?.map((child: any, i: number) => (
          <RenderLexicalNode key={i} node={child} />
        ))}
      </ListTag>
    )
  }

  // List item node
  if (node.type === 'listitem') {
    return (
      <li className="leading-relaxed">
        {node.children?.map((child: any, i: number) => (
          <RenderLexicalNode key={i} node={child} />
        ))}
      </li>
    )
  }

  // Blockquote
  if (node.type === 'quote') {
    return (
      <blockquote className="border-l-4 border-emerald-600 pl-4 py-1 my-3 italic text-slate-700 bg-emerald-50/50 rounded-r">
        {node.children?.map((child: any, i: number) => (
          <RenderLexicalNode key={i} node={child} />
        ))}
      </blockquote>
    )
  }

  // Table
  if (node.type === 'table') {
    return (
      <div className="overflow-x-auto my-4 border rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <tbody>
            {node.children?.map((row: any, i: number) => (
              <RenderLexicalNode key={i} node={row} />
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (node.type === 'tablerow') {
    return (
      <tr className="hover:bg-slate-50 transition-colors">
        {node.children?.map((cell: any, i: number) => (
          <RenderLexicalNode key={i} node={cell} />
        ))}
      </tr>
    )
  }

  if (node.type === 'tablecell') {
    const isHeader = node.headerState === 1 || node.headerState === 3
    const CellTag = isHeader ? 'th' : 'td'
    const cls = isHeader
      ? 'px-4 py-2.5 bg-slate-100 font-semibold text-slate-900 text-left border-b border-r last:border-r-0'
      : 'px-4 py-2 border-b border-r last:border-r-0 text-slate-700'
    return (
      <CellTag className={cls}>
        {node.children?.map((child: any, i: number) => (
          <RenderLexicalNode key={i} node={child} />
        ))}
      </CellTag>
    )
  }

  // Upload node
  if (node.type === 'upload' && node.value) {
    const url = node.value.url || `/api/media/file/${node.value.filename}`
    const alt = node.value.alt || 'Scientific illustration'
    return (
      <figure className="my-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={alt}
          className="rounded-lg shadow max-h-96 w-auto object-cover border border-slate-200"
        />
        {node.value.caption && (
          <figcaption className="text-xs text-slate-500 mt-1 italic">
            <RichText content={node.value.caption} />
          </figcaption>
        )}
      </figure>
    )
  }

  // Fallback for container nodes with children
  if (node.children && Array.isArray(node.children)) {
    return (
      <span>
        {node.children.map((child: any, i: number) => (
          <RenderLexicalNode key={i} node={child} />
        ))}
      </span>
    )
  }

  return null
}
